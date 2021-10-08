import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Classe } from "src/app/model/graphql";
import { BackendApiService } from "src/app/services/backend-api.service";
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
    backendApiService: BackendApiService,
    route: ActivatedRoute,
    router: Router,
    location: Location
  ) {
    super(backendApiService, router, route, location);
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
