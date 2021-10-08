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
import { Espece } from "src/app/model/graphql";
import { ListHelper } from "src/app/modules/shared/helpers/list-helper";
import { BackendApiService } from "src/app/services/backend-api.service";
import { EspeceFormComponent } from "../../components/form/espece-form/espece-form.component";
import { EntiteSimpleEditAbstractComponent } from "../entite-simple/entite-simple-edit.component";

type EspecesQueryResult = {
  especes: Espece[]
}

const ESPECES_QUERY = gql`
  query {
    especes {
      id
      code
      nomFrancais
      nomLatin
      classeId
    }
  }
`;

@Component({
  templateUrl: "../entite-simple/entity-edit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EspeceEditComponent
  extends EntiteSimpleEditAbstractComponent<Espece>
  implements OnInit, OnDestroy {

  private especes$: Observable<Espece[]>;


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
    this.especes$ = this.apollo.watchQuery<EspecesQueryResult>({
      query: ESPECES_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.especes;
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
        this.updateEspeceValidators(this.getForm(), entities);
      });
  }

  public createForm(): FormGroup {
    return new FormGroup({
      id: new FormControl("", []),
      classeId: new FormControl("", [Validators.required]),
      code: new FormControl("", [Validators.required]),
      nomFrancais: new FormControl("", [Validators.required]),
      nomLatin: new FormControl("", [Validators.required])
    });
  }

  public getFormType(): typeof EspeceFormComponent {
    return EspeceFormComponent;
  }

  public getEntityName = (): string => {
    return "espece";
  };

  public getEntities$(): Observable<Espece[]> {
    return this.especes$;
  }

  private updateEspeceValidators = (
    form: FormGroup,
    especes: Espece[]
  ): void => {
    form.setValidators([
      this.codeValidator(especes),
      this.nomFrancaisValidator(especes),
      this.nomLatinValidator(especes)
    ]);
    form.updateValueAndValidity();
  };

  private codeValidator = (especes: Espece[]): ValidatorFn => {
    return (form: FormGroup): ValidationErrors | null => {
      const code: string = form.controls.code.value;
      const currentEspeceId: number = form.controls.id.value;

      const matchingEspece = ListHelper.findEntityInListByStringAttribute(
        especes,
        "code",
        code
      );

      const isAnExistingEntity: boolean =
        !!matchingEspece && currentEspeceId !== matchingEspece.id;

      return isAnExistingEntity
        ? {
          alreadyExistingCode: {
            message: "Il existe déjà une espèce avec ce code."
          }
        }
        : null;
    };
  };

  private nomFrancaisValidator = (especes: Espece[]): ValidatorFn => {
    return (form: FormGroup): ValidationErrors | null => {
      const nomFrancais = form.controls.nomFrancais.value;
      const id = form.controls.id.value;

      const matchingEspece = ListHelper.findEntityInListByStringAttribute(
        especes,
        "nomFrancais",
        nomFrancais
      );

      const isAnExistingEntity: boolean =
        !!matchingEspece && id !== matchingEspece.id;

      return isAnExistingEntity
        ? {
          alreadyExistingNomFrancais: {
            message: "Il existe déjà une espèce avec ce nom français."
          }
        }
        : null;
    };
  };

  private nomLatinValidator = (especes: Espece[]): ValidatorFn => {
    return (form: FormGroup): ValidationErrors | null => {
      const nomLatin: string = form.controls.nomLatin.value;
      const currentEspeceId: number = form.controls.id.value;

      const matchingEspece = ListHelper.findEntityInListByStringAttribute(
        especes,
        "nomLatin",
        nomLatin
      );

      const isAnExistingEntity: boolean =
        !!matchingEspece && currentEspeceId !== matchingEspece.id;

      return isAnExistingEntity
        ? {
          alreadyExistingNomLatin: {
            message: "Il existe déjà une espèce avec ce nom scientifique."
          }
        }
        : null;
    };
  };

  public getPageTitle = (): string => {
    return "Espèces";
  };

  public getCreationTitle = (): string => {
    return "Création d'une espèce";
  };

  public getEditionTitle = (): string => {
    return "Edition d'une espèce";
  };
}
