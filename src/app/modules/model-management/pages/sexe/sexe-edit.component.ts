import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { InputSexe, MutationUpsertSexeArgs, Sexe } from "src/app/model/graphql";
import { StatusMessageService } from "src/app/services/status-message.service";
import { EntiteAvecLibelleEditAbstractComponent } from "../entite-avec-libelle/entite-avec-libelle-edit.component";

type SexesQueryResult = {
  sexes: Sexe[]
}

const SEXES_QUERY = gql`
  query {
    sexes {
      id
      libelle
    }
  }
`;

const SEXE_UPSERT = gql`
  mutation SexeUpsert($id: Int, $data: InputSexe!) {
    upsertSexe(id: $id, data: $data) {
      id
      libelle
    }
  }
`;

@Component({
  templateUrl: "../entite-simple/entity-edit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SexeEditComponent
  extends EntiteAvecLibelleEditAbstractComponent<Sexe>
  implements OnInit {

  private sexes$: Observable<Sexe[]>;

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
    this.sexes$ = this.apollo.watchQuery<SexesQueryResult>({
      query: SEXES_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.sexes;
      })
    );
    this.initialize();
  }

  public saveEntity = (formValue: InputSexe & { id: number }): void => {
    const { id, ...rest } = formValue;

    this.apollo.mutate<Sexe, MutationUpsertSexeArgs>({
      mutation: SEXE_UPSERT,
      variables: {
        id,
        data: rest
      }
    }).subscribe(({ data, errors }) => {
      if (data) {
        this.statusMessageService.showSuccessMessage(
          "Le sexe a été sauvegardé avec succès."
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
    return "sexe";
  };

  public getEntities$(): Observable<Sexe[]> {
    return this.sexes$;
  }

  public getPageTitle = (): string => {
    return "Sexes";
  };

  public getCreationTitle = (): string => {
    return "Création d'un sexe";
  };

  public getEditionTitle = (): string => {
    return "Edition d'un sexe";
  };
}
