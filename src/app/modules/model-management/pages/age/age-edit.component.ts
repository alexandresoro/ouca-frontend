import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Age } from "src/app/model/graphql";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
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
    entitiesStoreService: EntitiesStoreService,
    route: ActivatedRoute,
    router: Router,
    location: Location
  ) {
    super(entitiesStoreService, router, route, location);
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
