import { Component, Input, OnInit } from "@angular/core";
import { Commune } from "../../../model/commune.object";
import { Departement } from "../../../model/departement.object";
import { Lieudit } from "../../../model/lieudit.object";

@Component({
  selector: "input-lieudit",
  templateUrl: "./input-lieudit.tpl.html"
})
export class InputLieuditComponent implements OnInit {
  @Input() public departements: Departement[];

  @Input() public communes: Commune[];

  @Input() public lieuxdits: Lieudit[];

  @Input() public defaultDepartementId: number;

  @Input() public selectedLieudit: Lieudit;

  @Input() public selectedAltitude: number;

  @Input() public selectedLongitude: number;

  @Input() public selectedLatitude: number;

  @Input() public isDisabled: boolean;

  public selectedDepartement: Departement;

  public selectedCommune: Commune;

  public filteredCommunes: Commune[];

  public filteredLieuxdits: Lieudit[];

  public ngOnInit(): void {
    this.filteredCommunes = [];
    this.filteredLieuxdits = [];
    this.resetSelectedCoordinates();

    if (!this.selectedLieudit) {
      // No lieudit is selected, form is initialized with default values
      if (!!this.defaultDepartementId) {
        this.selectedDepartement = this.getDepartementById(
          this.defaultDepartementId
        );
        this.updateCommunes(this.selectedDepartement);
      }
    } else {
      const altitude = this.selectedAltitude;
      const longitude = this.selectedLongitude;
      const latitude = this.selectedLatitude;

      this.selectedCommune = this.getCommuneById(
        this.selectedLieudit.communeId
      );

      this.selectedDepartement = this.getDepartementById(
        this.selectedCommune.departementId
      );

      this.updateCommunes(this.selectedDepartement);
      this.updateLieuxdits();

      if (this.areCoordinatesCustomized(altitude, latitude, longitude)) {
        this.setSelectedCoordinates(altitude, longitude, latitude);
      }
    }
  }

  /**
   * When selecting a departement, filter the list of communes, set back the lieu-dit to empty lieu-dit
   */
  public updateCommunes(selectedDepartement: Departement): void {
    if (!!selectedDepartement && !!selectedDepartement.id) {
      this.filteredCommunes = this.communes.filter(
        (commune) => commune.departementId === selectedDepartement.id
      );

      this.filteredLieuxdits = [];
      this.resetSelectedCoordinates();
    }
  }

  /**
   * When selecting a commune, filter the list of lieux-dits
   */
  public updateLieuxdits(): void {
    if (!!this.selectedCommune && !!this.selectedCommune.id) {
      // METHOD 1 The lieux-dits are returned by init of the page
      this.filteredLieuxdits = this.lieuxdits.filter(
        (lieudit) => lieudit.communeId === this.selectedCommune.id
      );

      this.resetSelectedCoordinates();
    }
  }

  public updateCoordinates(): void {
    if (
      !!this.selectedLieudit &&
      !!this.selectedLieudit.altitude &&
      !!this.selectedLieudit.longitude &&
      !!this.selectedLieudit.latitude
    ) {
      this.setSelectedCoordinates(
        this.selectedLieudit.altitude,
        this.selectedLieudit.longitude,
        this.selectedLieudit.latitude
      );
    } else {
      this.resetSelectedCoordinates();
    }
  }

  private resetSelectedCoordinates(): void {
    this.setSelectedCoordinates(null, null, null);
  }

  private setSelectedCoordinates(
    altitude: number,
    longitude: number,
    latitude: number
  ): void {
    this.selectedAltitude = altitude;
    this.selectedLongitude = longitude;
    this.selectedLatitude = latitude;
  }
  private areCoordinatesCustomized(
    altitude: number,
    longitude: number,
    latitude: number
  ): boolean {
    return !!altitude || !!longitude || !!latitude;
  }

  private getDepartementById(id: number): Departement {
    return this.departements.find((departement) => departement.id === id);
  }

  private getCommuneById(id: number): Commune {
    return this.communes.find((commune) => commune.id === id);
  }
}
