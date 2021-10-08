import { Location } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable, Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { Departement } from "src/app/model/graphql";
import { ListHelper } from "src/app/modules/shared/helpers/list-helper";
import { BackendApiService } from "src/app/services/backend-api.service";
import { DepartementFormComponent } from "../../components/form/departement-form/departement-form.component";
import { EntiteSimpleEditAbstractComponent } from "../entite-simple/entite-simple-edit.component";

type DepartementsQueryResult = {
  departements: Departement[]
}

const DEPARTEMENTS_QUERY = gql`
  query {
    departements {
      id
      code
    }
  }
`;

@Component({
  templateUrl: "../entite-simple/entity-edit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartementEditComponent
  extends EntiteSimpleEditAbstractComponent<Departement>
  implements OnInit, OnDestroy {

  private departements$: Observable<Departement[]>;

  private readonly destroy$ = new Subject();

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
    this.departements$ = this.apollo.watchQuery<DepartementsQueryResult>({
      query: DEPARTEMENTS_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.departements;
      })
    );
    this.initialize();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected initialize(): void {
    super.initialize();

    this.getEntities$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((entities) => {
        this.updateDepartementValidators(this.getForm(), entities);
      });
  }

  public createForm(): FormGroup {
    return new FormGroup({
      id: new FormControl("", []),
      code: new FormControl("", [Validators.required])
    });
  }

  public getFormType(): typeof DepartementFormComponent {
    return DepartementFormComponent;
  }

  public getEntityName = (): string => {
    return "departement";
  };

  public getEntities$(): Observable<Departement[]> {
    return this.departements$;
  }

  private updateDepartementValidators = (
    form: FormGroup,
    departements: Departement[]
  ): void => {
    form.setValidators([this.departementValidator(departements)]);
    form.updateValueAndValidity();
  };

  private departementValidator = (departements: Departement[]): ValidatorFn => {
    return (form: FormGroup): ValidationErrors | null => {
      const code: string = form.controls.code.value;
      const currentDepartementId: number = form.controls.id.value;

      const matchingDepartement: Departement = ListHelper.findEntityInListByStringAttribute(
        departements,
        "code",
        code
      );

      const isAnExistingEntity: boolean =
        matchingDepartement && matchingDepartement.id !== currentDepartementId;

      return isAnExistingEntity
        ? {
          alreadyExistingCode: {
            message: "Il existe déjà un département avec ce code."
          }
        }
        : null;
    };
  };
  public getPageTitle = (): string => {
    return "Départements";
  };

  public getCreationTitle = (): string => {
    return "Création d'un département";
  };

  public getEditionTitle = (): string => {
    return "Edition d'un département";
  };
}
