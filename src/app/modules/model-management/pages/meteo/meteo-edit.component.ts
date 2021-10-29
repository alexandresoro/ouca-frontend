import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { InputMeteo, Meteo, MutationUpsertMeteoArgs } from "src/app/model/graphql";
import { StatusMessageService } from "src/app/services/status-message.service";
import { EntiteAvecLibelleEditAbstractComponent } from "../entite-avec-libelle/entite-avec-libelle-edit.component";

type MeteosQueryResult = {
  meteos: Meteo[]
}

const METEOS_QUERY = gql`
  query {
    meteos {
      id
      libelle
    }
  }
`;

const METEO_UPSERT = gql`
  mutation MeteoUpsert($id: Int, $data: InputMeteo!) {
    upsertMeteo(id: $id, data: $data) {
      id
      libelle
    }
  }
`;

@Component({
  templateUrl: "../entite-simple/entity-edit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeteoEditComponent
  extends EntiteAvecLibelleEditAbstractComponent<Meteo>
  implements OnInit {

  private meteos$: Observable<Meteo[]>;

  constructor(
    private apollo: Apollo,
    private statusMessageService: StatusMessageService,
    route: ActivatedRoute,
    router: Router,
    location: Location
  ) {
    super(router, route, location);
  }

  ngOnInit(): void {
    this.meteos$ = this.apollo.watchQuery<MeteosQueryResult>({
      query: METEOS_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.meteos;
      })
    );
    this.initialize();
  }

  public saveEntity = (formValue: InputMeteo & { id: number | null }): void => {
    const { id, ...rest } = formValue;

    this.apollo.mutate<Meteo, MutationUpsertMeteoArgs>({
      mutation: METEO_UPSERT,
      variables: {
        id,
        data: rest
      }
    }).subscribe(({ data, errors }) => {
      if (data) {
        this.statusMessageService.showSuccessMessage(
          "La météo a été sauvegardée avec succès."
        );
      } else {
        this.statusMessageService.showErrorMessage(
          "Une erreur est survenue pendant la sauvegarde.",
          JSON.stringify(errors)
        );
      }
      data && this.backToEntityPage();
    })
  };


  public getEntityName = (): string => {
    return "meteo";
  };

  public getEntities$(): Observable<Meteo[]> {
    return this.meteos$;
  }

  public getPageTitle = (): string => {
    return "Météos";
  };

  public getCreationTitle = (): string => {
    return "Création d'une météo";
  };

  public getEditionTitle = (): string => {
    return "Edition d'une météo";
  };
}
