import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ApolloQueryResult } from "@apollo/client/core";
import { Apollo, gql } from "apollo-angular";
import { DocumentNode } from "graphql";
import { getCoordinates } from "src/app/model/coordinates-system/coordinates-helper";
import { CommuneWithCounts, CoordinatesSystemType, LieuDitWithCounts, LieuxDitsPaginatedResult, Settings } from "src/app/model/graphql";
import { EntiteTableComponent } from "../entite-table/entite-table.component";

export type LieuDitRow = {
  id: number
  commune: CommuneWithCounts
  nom: string
  altitude: number
  longitude: number | string
  latitude: number | string
  nbDonnees: number
}

type PaginatedLieuxDitsAndCoordinatesQueryResult = {
  paginatedLieuxdits: LieuxDitsPaginatedResult
  settings: Pick<Settings, 'id' | 'coordinatesSystem'>
}

const PAGINATED_LIEUX_DITS_AND_COORDINATES_QUERY = gql`
  query PaginatedLieuxDitsAndCoordinates($searchParams: SearchParams, $orderBy: LieuxDitsOrderBy, $sortOrder: SortOrder) {
    paginatedLieuxdits (searchParams: $searchParams, orderBy: $orderBy, sortOrder: $sortOrder) {
      count
      result {
        id
        nom
        altitude
        longitude
        latitude
        coordinatesSystem
        commune {
          id
          code  
          nom
          departement {
            id
            code
          }
        }
        nbDonnees
      }
    }
    settings {
      id
      coordinatesSystem
    }
  }
`;

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

@Component({
  selector: "lieudit-table",
  styleUrls: ["./lieudit-table.component.scss"],
  templateUrl: "./lieudit-table.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LieuditTableComponent extends EntiteTableComponent<LieuDitRow, PaginatedLieuxDitsAndCoordinatesQueryResult> {

  public displayedColumns: string[] = [
    "departement",
    "codeCommune",
    "nomCommune",
    "nom",
    "latitude",
    "longitude",
    "altitude",
    "nbDonnees",
    "actions"
  ];

  constructor(
    apollo: Apollo
  ) {
    super(apollo);
  }

  protected getQuery(): DocumentNode {
    return PAGINATED_LIEUX_DITS_AND_COORDINATES_QUERY;
  }

  protected onQueryResultValueChange = ({ data }: ApolloQueryResult<PaginatedLieuxDitsAndCoordinatesQueryResult>): void => {
    const lieuxDits = data?.paginatedLieuxdits?.result ?? [];
    const lieuxDitsRow = lieuxDits?.map((lieudit) => {
      return buildRowFromLieudit(lieudit, data?.settings?.coordinatesSystem);
    }) ?? [];
    this.dataSource.updateValues(lieuxDitsRow, data?.paginatedLieuxdits?.count);
  }
}
