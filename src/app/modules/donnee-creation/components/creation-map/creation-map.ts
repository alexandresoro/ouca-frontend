import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import L from 'leaflet';
import 'leaflet.control.opacity';
import 'leaflet.markercluster';
import { combineLatest, Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil, withLatestFrom } from 'rxjs/operators';
import { Commune, Departement, LieuDit, QueryLieuDitArgs } from 'src/app/model/graphql';
import { baseMaps, markerDefault, markerGreen, markerRed, markerYellow, overlays } from 'src/app/modules/shared/objects/map-objects';
import { CreationMapService } from 'src/app/services/creation-map.service';

L.Marker.prototype.options.icon = markerDefault;

type LieuDitForTootltipQueryResult = {
  lieuDit: Pick<LieuDit, 'id' | 'nom'> & {
    commune: Pick<Commune, 'id' | 'nom'> & {
      departement: Departement
    }
  }
}

const INPUT_LIEUX_DIT_FOR_TOOLTIP_QUERY = gql`
  query LieuDitMap($id: Int!) {
    lieuDit(id: $id) {
      id
      nom
      commune {
        id
        nom
        departement {
          id
          code
        }
      }
    }
  }
`;


type CreationMapQueryResult = {
  lieuxDits: Pick<LieuDit, 'id' | 'latitude' | 'longitude'>[]
}

const CREATION_MAP_QUERY = gql`
  query {
    lieuxDits {
      id
      longitude
      latitude
    }
  }
`;

@Component({
  selector: "creation-map",
  styleUrls: ["./creation-map.scss"],
  templateUrl: "./creation-map.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreationMapComponent implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject();

  private map: L.Map;

  private markersPerLieuDit: { [key: number]: L.Marker } = {};

  private lieuditWithSpecificColor: number;

  private customMarkerPopupContent = document.createElement('span');
  private customMarkerDeleteLink = document.createElement('a');

  private customPositionMarker = L.marker(
    { lat: 0, lng: 0 },
    {
      draggable: true,
      riseOnHover: true,
      title: "Position personnalisée",
      icon: markerRed
    }
  ).on("contextmenu", () => { this.customPositionMarker.openPopup() })
    .bindTooltip("Coordonnées personnalisées")
    .bindPopup(this.customMarkerPopupContent);

  private customMarkerPosition$ = new Subject<L.LatLng>();

  private markersCluster = L.markerClusterGroup({
    chunkedLoading: true,
    disableClusteringAtZoom: 15
  });

  constructor(
    private apollo: Apollo,
    private creationMapService: CreationMapService
  ) {
    this.customMarkerPopupContent.append(this.customMarkerDeleteLink, " le point personnalisé");
    this.customMarkerPopupContent.style.cursor = "default";
    this.customMarkerDeleteLink.innerText = "Supprimer";
    this.customMarkerDeleteLink.style.cursor = "pointer";
    this.customMarkerDeleteLink.onclick = () => {
      this.customPositionMarker.closePopup();
      this.creationMapService.resetCustomControl();
    };
  }

  ngOnInit(): void {

    const queryResult$ = this.apollo.watchQuery<CreationMapQueryResult>({
      query: CREATION_MAP_QUERY
    }).valueChanges;

    // Create the map
    this.map = L.map('map', {
      preferCanvas: true,
      center: [45, 0],
      zoomSnap: 0.5,
      zoomDelta: 0.5,
      layers: [baseMaps.IGN],
      tap: false // ref https://github.com/Leaflet/Leaflet/issues/7255
    });

    // Add a scale
    L.control.scale({ imperial: false }).addTo(this.map);

    // Add map layers and control
    L.control.layers(baseMaps, overlays).addTo(this.map);
    L.control.opacity(overlays, {
      collapsed: true
    })
      .addTo(this.map);

    // Add the clusters to the map
    this.markersCluster.addTo(this.map);

    // Handle custom marker interactions
    this.customPositionMarker.on("dragend", () => this.customMarkerPosition$.next(this.customPositionMarker.getLatLng()));

    // Retrieve the list of existing lieux dits
    queryResult$
      .pipe(
        takeUntil(this.destroy$),
        map(({ data }) => {
          return data;
        })
      )
      .subscribe(this.onUpdatedLieuxDits);

    // Handle activation/deactivation of the custom marker
    this.creationMapService.getCustomMarkerInformation$()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((customMarkerInformation) => {
        if (customMarkerInformation.isActive) {
          if (!this.map.hasLayer(this.customPositionMarker)) {
            this.customPositionMarker.addTo(this.map);
          }
        } else {
          this.customPositionMarker.remove();
        }
      });

    // Emit moves of the custom position marker
    this.customMarkerPosition$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((latlng) => {
        this.creationMapService.setCustomMarkerPosition(latlng, true);
      });

    // When the focus is requested to be changed from outside the map, change it
    this.creationMapService.getCoordinatesToFocus$()
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe((coordinatesToFocus) => {
        this.map.fitBounds(new L.LatLngBounds(coordinatesToFocus), { maxZoom: 15, duration: 1 });
      });

    // Handle the position of the custom marker when it is changed from outside the map
    this.creationMapService.getLieuDitControlChangeEvent$()
      .pipe(
        withLatestFrom(
          this.creationMapService.getSelectedLieuDitId$(),
          this.creationMapService.getCustomMarkerInformation$(),
          this.creationMapService.getCustomMarkerPosition$()
        ),
        takeUntil(this.destroy$)
      ).subscribe(([v, selectedLieuDit, customMarkerInfo, customMarkerPosition]) => {
        if (customMarkerInfo?.isActive && !selectedLieuDit) {
          const position = customMarkerPosition?.coordinates;
          if (position && !position.equals(this.customPositionMarker.getLatLng())) {
            this.customPositionMarker.setLatLng(position);
          }
        }
      });

    // Handle markers that should have a specific color
    combineLatest([
      this.creationMapService.getSelectedLieuDitId$(),
      this.creationMapService.getCustomMarkerInformation$(),
      this.creationMapService.getFocusedLieuDitId$()
    ])
      .pipe(
        distinctUntilChanged(([selA, cusA, focA], [selB, cusB, focB]) => {
          return (selA === selB) && (cusA?.linkedLieuDitId === cusB.linkedLieuDitId) && (focA === focB);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(([selectedLieuDitId, customMarkerInfo, focusedLieuDitId]) => {
        const linkedLieuDitId = customMarkerInfo?.linkedLieuDitId;

        // Reset the cursor that previously had a custom color to default
        this.markersPerLieuDit[this.lieuditWithSpecificColor]?.setIcon(markerDefault);

        // One icon should be in yellow if it is a "linked" lieu dit
        if (linkedLieuDitId) {
          this.markersPerLieuDit[linkedLieuDitId]?.setIcon(markerYellow);
          this.lieuditWithSpecificColor = linkedLieuDitId;
          return;
        }

        // Otherwise, one icon should be in red if it is selected
        if (selectedLieuDitId) {
          this.markersPerLieuDit[selectedLieuDitId]?.setIcon(markerRed);
          this.lieuditWithSpecificColor = selectedLieuDitId;
          return;
        }

        // Finally, one icon should be in green if it is only focused
        if (focusedLieuDitId) {
          this.markersPerLieuDit[focusedLieuDitId]?.setIcon(markerGreen);
          this.lieuditWithSpecificColor = focusedLieuDitId;
          return;
        }

      });

  }

  ngOnDestroy(): void {
    this.map.remove();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private onExistingLieuDitClick = (lieuditId: number) => {
    this.creationMapService.setSelectedLieuDitId(lieuditId);
  };

  private createCustomMarker = (lieuditMarker: L.Marker, lieuditId: number) => {
    this.creationMapService.setCustomMarkerInformation({ isActive: true, linkedLieuDitId: lieuditId });
    this.customPositionMarker.setLatLng(lieuditMarker.getLatLng());
    this.customMarkerPosition$.next(this.customPositionMarker.getLatLng());
  }

  private onUpdatedLieuxDits = (data: CreationMapQueryResult) => {
    const { lieuxDits } = data;
    const markers = lieuxDits.map((lieuDit) => {
      const marker = L.marker([lieuDit.latitude, lieuDit.longitude]).bindTooltip("");

      marker.on('mouseover', () => {
        this.apollo.query<LieuDitForTootltipQueryResult, QueryLieuDitArgs>({
          query: INPUT_LIEUX_DIT_FOR_TOOLTIP_QUERY,
          variables: {
            id: lieuDit.id
          }
        }).pipe(
          map(({ data }) => data?.lieuDit)
        )
          .toPromise()
          .then((lieuDitInfo) => {
            marker.setTooltipContent(`${lieuDitInfo.nom} -  ${lieuDitInfo.commune.nom.toUpperCase()} (${lieuDitInfo.commune.departement.code})`)
          })
          .catch(() => {
            marker.setTooltipContent(null);
          });
      })

      // Handle click on a marker
      marker.on('click', () => { this.onExistingLieuDitClick(lieuDit.id) });

      // Handle right click on a marker
      marker.on("contextmenu", () => {
        this.createCustomMarker(marker, lieuDit.id);
      });

      this.markersPerLieuDit[lieuDit.id] = marker;
      return marker;
    });

    this.markersCluster.clearLayers();
    this.markersCluster.addLayers(markers);
  }

}
