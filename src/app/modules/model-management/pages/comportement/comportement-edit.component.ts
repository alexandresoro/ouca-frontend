import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Comportement } from "src/app/model/graphql";
import { Nicheur, NICHEUR_VALUES } from 'src/app/model/types/nicheur.model';
import { CrossFieldErrorMatcher } from "src/app/modules/shared/matchers/cross-field-error.matcher";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
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
    entitiesStoreService: EntitiesStoreService,
    route: ActivatedRoute,
    router: Router,
    location: Location
  ) {
    super(entitiesStoreService, router, route, location);
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
