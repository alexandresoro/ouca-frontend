import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { InputMilieu, Milieu, MutationUpsertMilieuArgs } from "src/app/model/graphql";
import { StatusMessageService } from "src/app/services/status-message.service";
import { EntiteAvecLibelleEtCodeEditAbstractComponent } from "../entite-avec-libelle-et-code/entite-avec-libelle-et-code-edit.component";

type MilieuxQueryResult = {
  milieux: Milieu[]
}

const MILIEUX_QUERY = gql`
  query {
    milieux {
      id
      code
      libelle
    }
  }
`;

const MILIEU_UPSERT = gql`
  mutation MilieuUpsert($id: Int, $data: InputMilieu!) {
    upsertMilieu(id: $id, data: $data) {
      id
      code
      libelle
    }
  }
`;

@Component({
  templateUrl: "../entite-simple/entity-edit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MilieuEditComponent
  extends EntiteAvecLibelleEtCodeEditAbstractComponent<Milieu>
  implements OnInit {

  private milieux$: Observable<Milieu[]>;

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
    this.milieux$ = this.apollo.watchQuery<MilieuxQueryResult>({
      query: MILIEUX_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.milieux;
      })
    );
    this.initialize();
  }

  public saveEntity = (formValue: InputMilieu & { id: number | null }): void => {
    const { id, ...rest } = formValue;

    this.apollo.mutate<Milieu, MutationUpsertMilieuArgs>({
      mutation: MILIEU_UPSERT,
      variables: {
        id,
        data: rest
      }
    }).subscribe(({ data, errors }) => {
      if (data) {
        this.statusMessageService.showSuccessMessage(
          "Le milieu a été sauvegardée avec succès."
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
    return "milieu";
  };

  public getEntities$(): Observable<Milieu[]> {
    return this.milieux$;
  }

  public getPageTitle = (): string => {
    return "Milieux";
  };

  public getCreationTitle = (): string => {
    return "Création d'un milieu";
  };

  public getEditionTitle = (): string => {
    return "Edition d'un milieu";
  };
}
