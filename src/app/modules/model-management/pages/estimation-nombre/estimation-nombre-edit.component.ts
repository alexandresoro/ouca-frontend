import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { EstimationNombre } from "src/app/model/graphql";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { EstimationNombreFormComponent } from "../../components/form/estimation-nombre-form/estimation-nombre-form.component";
import { EntiteAvecLibelleEditAbstractComponent } from "../entite-avec-libelle/entite-avec-libelle-edit.component";

type EstimationsNombreQueryResult = {
  estimationsNombre: EstimationNombre[]
}

const ESTIMATIONS_NOMBRE_QUERY = gql`
  query {
    estimationsNombre {
      id
      libelle
      nonCompte
    }
  }
`;

@Component({
  templateUrl: "../entite-simple/entity-edit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstimationNombreEditComponent
  extends EntiteAvecLibelleEditAbstractComponent<EstimationNombre>
  implements OnInit {

  private estimationsNombre$: Observable<EstimationNombre[]>;

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
    this.estimationsNombre$ = this.apollo.watchQuery<EstimationsNombreQueryResult>({
      query: ESTIMATIONS_NOMBRE_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.estimationsNombre;
      })
    );
    this.initialize();
  }

  public createForm(): FormGroup {
    return new FormGroup({
      id: new FormControl("", []),
      libelle: new FormControl("", [Validators.required]),
      nonCompte: new FormControl("")
    });
  }

  getEntityFromFormValue(formValue: {
    id: number;
    libelle: string;
    nonCompte: boolean;
  }): EstimationNombre {
    const { nonCompte, ...estimationAttributes } = formValue;
    return {
      ...estimationAttributes,
      nonCompte: !!nonCompte
    };
  }

  public getEntityName = (): string => {
    return "estimation-nombre";
  };

  public getEntities$(): Observable<EstimationNombre[]> {
    return this.estimationsNombre$;
  }

  public getFormType(): typeof EstimationNombreFormComponent {
    return EstimationNombreFormComponent;
  }

  public getPageTitle = (): string => {
    return "Estimations du nombre";
  };

  public getCreationTitle = (): string => {
    return "Création d'une estimation du nombre";
  };

  public getEditionTitle = (): string => {
    return "Edition d'une estimation du nombre";
  };
}
