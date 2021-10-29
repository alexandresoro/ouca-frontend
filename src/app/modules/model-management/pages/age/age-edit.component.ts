import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Age, InputAge, MutationUpsertAgeArgs } from "src/app/model/graphql";
import { StatusMessageService } from "src/app/services/status-message.service";
import { EntiteAvecLibelleEditAbstractComponent } from "../entite-avec-libelle/entite-avec-libelle-edit.component";

type AgesQueryResult = {
  ages: Age[]
}

const AGES_QUERY = gql`
  query {
    ages {
      id
      libelle
    }
  }
`;

const AGE_UPSERT = gql`
  mutation AgeUpsert($id: Int, $data: InputAge!) {
    upsertAge(id: $id, data: $data) {
      id
      libelle
    }
  }
`;

@Component({
  templateUrl: "../entite-simple/entity-edit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgeEditComponent
  extends EntiteAvecLibelleEditAbstractComponent<Age>
  implements OnInit {

  private ages$: Observable<Age[]>;

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
    this.ages$ = this.apollo.watchQuery<AgesQueryResult>({
      query: AGES_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.ages;
      })
    );
    this.initialize();
  }

  public saveEntity = (formValue: InputAge & { id: number }): void => {
    const { id, ...rest } = formValue;

    this.apollo.mutate<Age, MutationUpsertAgeArgs>({
      mutation: AGE_UPSERT,
      variables: {
        id,
        data: rest
      }
    }).subscribe(({ data, errors }) => {
      if (data) {
        this.statusMessageService.showSuccessMessage(
          "L'âge a été sauvegardé avec succès."
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
    return "age";
  };

  public getEntities$(): Observable<Age[]> {
    return this.ages$;
  }

  public getPageTitle = (): string => {
    return "Âges";
  };

  public getCreationTitle = (): string => {
    return "Création d'un âge";
  };

  public getEditionTitle = (): string => {
    return "Edition d'un âge";
  };
}
