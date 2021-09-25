import { getCoordinates } from "src/app/model/coordinates-system/coordinates-helper";
import { CommuneWithCounts, CoordinatesSystemType, LieuDitWithCounts, LieuxDitsOrderBy, SortOrder } from "src/app/model/graphql";
import { LieuxDitsGetService } from "src/app/services/lieux-dits-get.service";
import { EntitesTableDataSource } from "../entite-table/EntitesTableDataSource";

export interface LieuDitRow {
  id: number;
  commune: CommuneWithCounts;
  nom: string;
  altitude: number;
  longitude: number | string;
  latitude: number | string;
  nbDonnees: number;
}

const buildRowFromLieudit = (
  lieudit: LieuDitWithCounts,
  coordinatesSystemType: CoordinatesSystemType
): LieuDitRow => {

  const coordinates = getCoordinates(
    {
      coordinates: {
        system: lieudit.coordinatesSystem,
        latitude: lieudit.latitude,
        longitude: lieudit.longitude
      }
    },
    coordinatesSystemType
  );

  return {
    id: lieudit.id,
    commune: lieudit.commune,
    nom: lieudit.nom,
    altitude: lieudit.altitude,
    longitude: coordinates.areInvalid
      ? "Non supporté"
      : coordinates.longitude,
    latitude: coordinates.areInvalid ? "Non supporté" : coordinates.latitude,
    nbDonnees: lieudit.nbDonnees
  };
}

export class LieuxDitsDataSource extends EntitesTableDataSource<LieuDitRow> {

  constructor(private lieuxDitsGetService: LieuxDitsGetService) {
    super();
  }

  loadLieuxDits(pageNumber: number, pageSize: number, orderBy: LieuxDitsOrderBy = undefined, sortOrder: SortOrder | "" = SortOrder.Asc, q: string = undefined, coordinatesSystem: CoordinatesSystemType): void {

    if (!coordinatesSystem) {
      return;
    }

    this.setLoadingState();

    this.lieuxDitsGetService.fetch({ searchParams: { pageNumber, pageSize, q }, orderBy, sortOrder: sortOrder !== "" ? sortOrder : undefined }, { fetchPolicy: "network-only" }).subscribe(({ data }) => {
      this.disableLoadingState();
      const lieuxDits = data?.paginatedLieuxdits?.result ?? [];
      this.countSubject.next(data?.paginatedLieuxdits?.count);

      const lieuxDitsRow = lieuxDits?.map((lieudit) => {
        return buildRowFromLieudit(lieudit, coordinatesSystem);
      }) ?? [];

      this.entitesSubject.next(lieuxDitsRow);
    });
  }

}