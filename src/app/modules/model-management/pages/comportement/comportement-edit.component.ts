import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Comportement, InputComportement, MutationUpsertComportementArgs } from "src/app/model/graphql";
import { Nicheur, NICHEUR_VALUES } from 'src/app/model/types/nicheur.model';
import { CrossFieldErrorMatcher } from "src/app/modules/shared/matchers/cross-field-error.matcher";
import { StatusMessageService } from "src/app/services/status-message.service";
import { EntiteAvecLibelleEtCodeEditAbstractComponent } from "../entite-avec-libelle-et-code/entite-avec-libelle-et-code-edit.component";

type ComportementsQueryResult = {
  comportements: Comportement[]
}

const COMPORTEMENTS_QUERY = gql`
  query {
    comportements {
      id
      code
      libelle
      nicheur
    }
  }
`;

const COMPORTEMENT_UPSERT = gql`
  mutation ComportementUpsert($id: Int, $data: InputComportement!) {
    upsertComportement(id: $id, data: $data) {
      id
      code
      libelle
      nicheur
    }
  }
`;



@Component({
  templateUrl: "./comportement-edit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComportementEditComponent
  extends EntiteAvecLibelleEtCodeEditAbstractComponent<Comportement>
  implements OnInit {
  public codeErrorStateMatcher = new CrossFieldErrorMatcher(
    "alreadyExistingCode"
  );

  public libelleErrorStateMatcher = new CrossFieldErrorMatcher(
    "alreadyExistingLibelle"
  );

  private comportements$: Observable<Comportement[]>;

  public nicheurValues: Nicheur[] = Object.values(NICHEUR_VALUES);

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
    this.comportements$ = this.apollo.watchQuery<ComportementsQueryResult>({
      query: COMPORTEMENTS_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.comportements;
      })
    );
    this.initialize();
  }

  public saveEntity = (formValue: InputComportement & { id: number | null }): void => {
    const { id, ...rest } = formValue;

    this.apollo.mutate<Comportement, MutationUpsertComportementArgs>({
      mutation: COMPORTEMENT_UPSERT,
      variables: {
        id,
        data: rest
      }
    }).subscribe(({ data, errors }) => {
      if (data) {
        this.statusMessageService.showSuccessMessage(
          "Le comportement a été sauvegardée avec succès."
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
    return "comportement";
  };

  public getEntities$(): Observable<Comportement[]> {
    return this.comportements$;
  }

  public createForm(): FormGroup {
    const form = super.createForm();
    form.addControl("nicheur", new FormControl());
    return form;
  }
  public getPageTitle = (): string => {
    return "Comportements";
  };

  public getCreationTitle = (): string => {
    return "Création d'un comportement";
  };

  public getEditionTitle = (): string => {
    return "Edition d'un comportement";
  };
}
