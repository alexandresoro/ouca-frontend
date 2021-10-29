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
import deburr from 'lodash.deburr';
import { Observable, Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { Commune, InputCommune, MutationUpsertCommuneArgs } from "src/app/model/graphql";
import { FormValidatorHelper } from "src/app/modules/shared/helpers/form-validator.helper";
import { StatusMessageService } from "src/app/services/status-message.service";
import { CommuneFormComponent } from "../../components/form/commune-form/commune-form.component";
import { EntiteSimpleEditAbstractComponent } from "../entite-simple/entite-simple-edit.component";

type CommuneWithDepartementId = Omit<Commune, 'departement'> & { departement: { id: number } };

type CommunesQueryResult = {
  communes: CommuneWithDepartementId[]
}

const COMMUNES_QUERY = gql`
  query {
    communes {
      id
      code
      nom
      departement {
        id
      }
    }
  }
`;

const COMMUNE_UPSERT = gql`
  mutation CommuneUpsert($id: Int, $data: InputCommune!) {
    upsertCommune(id: $id, data: $data) {
      id
      code
      nom
      departement {
        id
        code
      }
    }
  }
`;


@Component({
  templateUrl: "../entite-simple/entity-edit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommuneEditComponent
  extends EntiteSimpleEditAbstractComponent<CommuneWithDepartementId>
  implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();

  private communes$: Observable<CommuneWithDepartementId[]>;

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
    this.communes$ = this.apollo.watchQuery<CommunesQueryResult>({
      query: COMMUNES_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.communes;
      })
    );
    this.initialize();
  }

  public saveEntity = (formValue: InputCommune & { id: number }): void => {
    const { id, ...rest } = formValue;

    this.apollo.mutate<Commune, MutationUpsertCommuneArgs>({
      mutation: COMMUNE_UPSERT,
      variables: {
        id,
        data: rest
      }
    }).subscribe(({ data, errors }) => {
      if (data) {
        this.statusMessageService.showSuccessMessage(
          "La commune a été sauvegardée avec succès."
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected initialize(): void {
    super.initialize();

    this.getEntities$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((entities) => {
        this.updateCommuneValidators(this.getForm(), entities);
      });
  }

  public createForm(): FormGroup {
    return new FormGroup({
      id: new FormControl("", []),
      departementId: new FormControl("", [Validators.required]),
      code: new FormControl("", [
        Validators.required,
        this.codeNumberValidator()
      ]),
      nom: new FormControl("", [Validators.required])
    });
  }

  protected getFormValue(
    commune: Commune
  ): {
    id: number;
    departementId: number;
    code: number;
    nom: string;
  } {
    const { departement, ...rest } = commune;
    return {
      ...rest,
      departementId: departement?.id
    };
  }

  public getFormType(): typeof CommuneFormComponent {
    return CommuneFormComponent;
  }

  public getEntityName = (): string => {
    return "commune";
  };

  public getEntities$(): Observable<(Omit<Commune, 'departement'> & { departement: { id: number } })[]> {
    return this.communes$;
  }

  private updateCommuneValidators = (
    form: FormGroup,
    communes: CommuneWithDepartementId[]
  ): void => {
    form.setValidators([
      this.codeValidator(communes),
      this.nomValidator(communes)
    ]);
    form.updateValueAndValidity();
  };

  private codeValidator = (communes: CommuneWithDepartementId[]): ValidatorFn => {
    return (form: FormGroup): ValidationErrors | null => {
      const code: number = form.controls.code.value;
      const departementId: number = form.controls.departementId.value;
      const currentCommuneId: number = form.controls.id.value;

      const matchingCommune = communes?.find((commune) => {
        return (
          commune.code === code && commune?.departement?.id === departementId
        );
      });

      const isAnExistingEntity: boolean =
        !!matchingCommune && currentCommuneId !== matchingCommune.id;

      return isAnExistingEntity
        ? FormValidatorHelper.getValidatorResult(
          "alreadyExistingCode",
          "Il existe déjà une commune avec ce code dans ce département."
        )
        : null;
    };
  };

  private codeNumberValidator = (): ValidatorFn => {
    return FormValidatorHelper.isAnIntegerValidator(0, 65535);
  };

  private nomValidator = (communes: CommuneWithDepartementId[]): ValidatorFn => {
    return (form: FormGroup): ValidationErrors | null => {
      const nom: string = form.controls.nom.value;
      const departementId: number = form.controls.departementId.value;
      const currentCommuneId: number = form.controls.id.value;

      const matchingCommune = nom
        ? communes?.find((commune) => {
          return (
            deburr(commune.nom.trim().toLowerCase()) ===
            deburr(nom.trim().toLowerCase()) &&
            commune?.departement?.id === departementId
          );
        })
        : null;

      const valueIsAnExistingEntity: boolean =
        !!matchingCommune && currentCommuneId !== matchingCommune.id;

      return valueIsAnExistingEntity
        ? FormValidatorHelper.getValidatorResult(
          "alreadyExistingNom",
          "Il existe déjà une commune avec ce nom dans ce département."
        )
        : null;
    };
  };

  public getPageTitle = (): string => {
    return "Communes";
  };

  public getCreationTitle = (): string => {
    return "Création d'une commune";
  };

  public getEditionTitle = (): string => {
    return "Edition d'une commune";
  };
}
