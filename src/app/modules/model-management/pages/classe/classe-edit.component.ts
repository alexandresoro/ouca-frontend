import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Classe, InputClasse, MutationUpsertClasseArgs } from "src/app/model/graphql";
import { StatusMessageService } from "src/app/services/status-message.service";
import { EntiteAvecLibelleEditAbstractComponent } from "../entite-avec-libelle/entite-avec-libelle-edit.component";

type ClassesQueryResult = {
  classes: Classe[]
}

const CLASSES_QUERY = gql`
  query {
    classes {
      id
      libelle
    }
  }
`;

const CLASSE_UPSERT = gql`
  mutation ClasseUpsert($id: Int, $data: InputClasse!) {
    upsertClasse(id: $id, data: $data) {
      id
      libelle
    }
  }
`;

@Component({
  templateUrl: "../entite-simple/entity-edit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClasseEditComponent
  extends EntiteAvecLibelleEditAbstractComponent<Classe>
  implements OnInit {

  private classes$: Observable<Classe[]>;

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
    this.classes$ = this.apollo.watchQuery<ClassesQueryResult>({
      query: CLASSES_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.classes;
      })
    );
    this.initialize();
  }

  public saveEntity = (formValue: InputClasse & { id: number }): void => {
    const { id, ...rest } = formValue;

    this.apollo.mutate<Classe, MutationUpsertClasseArgs>({
      mutation: CLASSE_UPSERT,
      variables: {
        id,
        data: rest
      }
    }).subscribe(({ data, errors }) => {
      if (data) {
        this.statusMessageService.showSuccessMessage(
          "La classe a été sauvegardée avec succès."
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
    return "classe";
  };

  public getEntities$(): Observable<Classe[]> {
    return this.classes$;
  }

  public getPageTitle = (): string => {
    return "Classes espèces";
  };

  public getCreationTitle = (): string => {
    return "Création d'une classe espèce";
  };

  public getEditionTitle = (): string => {
    return "Edition d'une classe espèce";
  };
}
