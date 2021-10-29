import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { InputObservateur, MutationUpsertObservateurArgs, Observateur } from "src/app/model/graphql";
import { StatusMessageService } from "src/app/services/status-message.service";
import { EntiteAvecLibelleEditAbstractComponent } from "../entite-avec-libelle/entite-avec-libelle-edit.component";

type ObservateursQueryResult = {
  observateurs: Observateur[]
}

const OBSERVATEURS_QUERY = gql`
  query {
    observateurs {
      id
      libelle
    }
  }
`;

const OBSERVATEUR_UPSERT = gql`
  mutation ObservateurUpsert($id: Int, $data: InputObservateur!) {
    upsertObservateur(id: $id, data: $data) {
      id
      libelle
    }
  }
`;


@Component({
  templateUrl: "../entite-simple/entity-edit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObservateurEditComponent
  extends EntiteAvecLibelleEditAbstractComponent<Observateur>
  implements OnInit {

  private observateurs$: Observable<Observateur[]>;

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
    this.observateurs$ = this.apollo.watchQuery<ObservateursQueryResult>({
      query: OBSERVATEURS_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.observateurs;
      })
    );
    this.initialize();
  }

  public saveEntity = (formValue: InputObservateur & { id: number }): void => {
    const { id, ...rest } = formValue;

    this.apollo.mutate<Observateur, MutationUpsertObservateurArgs>({
      mutation: OBSERVATEUR_UPSERT,
      variables: {
        id,
        data: rest
      }
    }).subscribe(({ data, errors }) => {
      if (data) {
        this.statusMessageService.showSuccessMessage(
          "L'observateur a été sauvegardé avec succès."
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
    return "observateur";
  };

  public getEntities$(): Observable<Observateur[]> {
    return this.observateurs$;
  }

  public getPageTitle = (): string => {
    return "Observateurs";
  };

  public getCreationTitle = (): string => {
    return "Création d'un observateur";
  };

  public getEditionTitle = (): string => {
    return "Edition d'un observateur";
  };
}
