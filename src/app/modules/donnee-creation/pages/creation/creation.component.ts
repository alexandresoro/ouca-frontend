import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Age } from "ouca-common/age.object";
import { AppConfiguration } from "ouca-common/app-configuration.object";
import { Comportement } from "ouca-common/comportement.object";
import {
  CoordinatesSystem,
  CoordinatesSystemType,
  COORDINATES_SYSTEMS_CONFIG
} from "ouca-common/coordinates-system";
import { Donnee } from "ouca-common/donnee.object";
import { EstimationDistance } from "ouca-common/estimation-distance.object";
import { EstimationNombre } from "ouca-common/estimation-nombre.object";
import { Meteo } from "ouca-common/meteo.object";
import { Milieu } from "ouca-common/milieu.object";
import { Observateur } from "ouca-common/observateur.object";
import { Sexe } from "ouca-common/sexe.object";
import {
  BehaviorSubject,
  combineLatest,
  forkJoin,
  fromEvent,
  Observable,
  Subject
} from "rxjs";
import {
  distinctUntilChanged,
  filter,
  first,
  map,
  takeUntil,
  tap,
  withLatestFrom
} from "rxjs/operators";
import { AppConfigurationService } from "src/app/services/app-configuration.service";
import { CoordinatesBuilderService } from "src/app/services/coordinates-builder.service";
import { CreationCacheService } from "src/app/services/creation-cache.service";
import { CreationModeService } from "src/app/services/creation-mode.service";
import { DonneeFormService } from "src/app/services/donnee-form.service";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { InventaireFormService } from "src/app/services/inventaire-form.service";
import { CreationPageService } from "../../../../services/creation-page.service";
import { DonneeService } from "../../../../services/donnee.service";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { MultipleOptionsDialogComponent } from "../../../shared/components/multiple-options-dialog/multiple-options-dialog.component";
import { SearchByIdDialogComponent } from "../../components/search-by-id-dialog/search-by-id-dialog.component";
import {
  getDeleteDonneeDialogData,
  getUpdateInventaireDialogData
} from "../../helpers/creation-dialog.helper";

@Component({
  styleUrls: ["./creation.component.scss"],
  templateUrl: "./creation.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreationComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();

  private requestedDonneeId: number;

  public appConfiguration$: Observable<AppConfiguration>;

  public observateurs$: Observable<Observateur[]>;

  public estimationsNombre$: Observable<EstimationNombre[]>;

  public estimationsDistance$: Observable<EstimationDistance[]>;

  public sexes$: Observable<Sexe[]>;

  public ages$: Observable<Age[]>;

  public comportements$: Observable<Comportement[]>;

  public milieux$: Observable<Milieu[]>;

  public meteos$: Observable<Meteo[]>;

  public inventaireForm: FormGroup;

  public donneeForm: FormGroup;

  private clearDonnee$: Subject<Donnee> = new Subject<Donnee>();

  private coordinatesSystem$: Observable<CoordinatesSystemType>;

  private isModalOpened$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  constructor(
    private appConfigurationService: AppConfigurationService,
    private creationModeService: CreationModeService,
    private creationPageService: CreationPageService,
    private creationCacheService: CreationCacheService,
    private entitiesStoreService: EntitiesStoreService,
    private dialog: MatDialog,
    private donneeFormService: DonneeFormService,
    private coordinatesBuilderService: CoordinatesBuilderService,
    private donneeService: DonneeService,
    private inventaireFormService: InventaireFormService,
    private router: Router
  ) {
    this.requestedDonneeId = this.router.getCurrentNavigation()?.extras?.state?.id;

    this.appConfiguration$ = this.appConfigurationService.getConfiguration$();
    this.coordinatesSystem$ = this.appConfiguration$.pipe(
      map((configuration) => configuration.coordinatesSystem)
    );

    this.observateurs$ = this.entitiesStoreService.getObservateurs$();
    this.estimationsNombre$ = this.entitiesStoreService.getEstimationNombres$();
    this.estimationsDistance$ = this.entitiesStoreService.getEstimationDistances$();
    this.sexes$ = this.entitiesStoreService.getSexes$();
    this.ages$ = this.entitiesStoreService.getAges$();
    this.comportements$ = this.entitiesStoreService.getComportements$();
    this.milieux$ = this.entitiesStoreService.getMilieux$();
    this.meteos$ = this.entitiesStoreService.getMeteos$();
  }

  public ngOnInit(): void {
    // Create the inventaire form group
    this.inventaireForm = this.inventaireFormService.createForm();
    this.donneeForm = this.donneeFormService.createForm();

    /**
     * When clicking on Enter, we save the inventaire or donnee
     * if it is valid
     * and if the focus is not on a textarea field which can contain several lines
     */
    fromEvent(document, "keyup")
      .pipe(
        withLatestFrom(this.isModalOpened$),
        filter(([event, isModalOpened]) => {
          return (
            (event as KeyboardEvent).key === "Enter" &&
            document.activeElement.tagName.toLowerCase() !== "textarea" &&
            !isModalOpened
          );
        })
      )
      .subscribe(() => {
        this.onSaveButtonClicked();
      });

    // If a specific id was requested, retrieve it
    let initialDonnee$: Observable<boolean>;
    const isInitialDonneeDonneeActive$ = new BehaviorSubject<boolean>(null);
    if (this.requestedDonneeId) {
      initialDonnee$ = this.donneeService
        .getDonneeById(this.requestedDonneeId)
        .pipe(
          tap(() => {
            this.requestedDonneeId = null;
          })
        );
    } else {
      initialDonnee$ = this.donneeService.initialize().pipe(map(() => false));
    }
    initialDonnee$.subscribe((isInitialDonneeDonneeActive) => {
      isInitialDonneeDonneeActive$.next(isInitialDonneeDonneeActive);
      isInitialDonneeDonneeActive$.complete();
    });

    // Update the coordinates form controls depending on the application coordinates system
    this.appConfigurationService
      .getAppCoordinatesSystemType$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((coordinatesSystemType) => {
        this.coordinatesBuilderService.updateCoordinatesValidators(
          coordinatesSystemType,
          (this.inventaireForm.controls.lieu as FormGroup).controls.longitude,
          (this.inventaireForm.controls.lieu as FormGroup).controls.latitude
        );
      });

    combineLatest(
      this.entitiesStoreService.getInventaireEntities$(),
      this.entitiesStoreService.getDepartements$(),
      this.donneeService.getCurrentDonnee$().pipe(
        distinctUntilChanged(),
        map((donnee) => donnee?.inventaire)
      ),
      this.appConfiguration$
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(([pageModel, departements, inventaire, appConfiguration]) => {
        this.inventaireFormService.updateForm(
          this.inventaireForm,
          pageModel,
          departements,
          inventaire,
          appConfiguration
        );
      });

    combineLatest(
      this.entitiesStoreService.getDonneeEntities$(),
      this.donneeService.getCurrentDonnee$().pipe(distinctUntilChanged()),
      this.appConfiguration$
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(([pageModel, donnee, appConfiguration]) => {
        this.donneeFormService.updateForm(
          this.donneeForm,
          pageModel,
          appConfiguration,
          donnee
        );
      });

    this.clearDonnee$
      .pipe(
        takeUntil(this.destroy$),
        withLatestFrom(
          this.entitiesStoreService.getDonneeEntities$(),
          this.appConfiguration$
        )
      )
      .subscribe(([clearDonnee, donneeEntities, appConfiguration]) => {
        this.donneeFormService.updateForm(
          this.donneeForm,
          donneeEntities,
          appConfiguration,
          null
        );
      });

    this.creationModeService
      .getIsInventaireEnabled$()
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((isInventaireEnabled) => {
        if (isInventaireEnabled && this.inventaireForm.disabled) {
          this.inventaireForm.enable();
        } else if (!isInventaireEnabled && this.inventaireForm.enabled) {
          this.inventaireForm.disable();
        }
      });

    this.creationModeService
      .getIsDonneeEnabled$()
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((isDonneeEnabled) => {
        if (isDonneeEnabled && this.donneeForm.disabled) {
          this.donneeForm.enable();
        } else if (!isDonneeEnabled && this.donneeForm.enabled) {
          this.donneeForm.disable();
        }
      });

    this.creationModeService
      .getStatus$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        const elementToFocus =
          status.isDonneeEnabled && !status.isInventaireEnabled
            ? "input-Espèce"
            : "input-Observateur";
        document.getElementById(elementToFocus)?.focus();
      });

    this.dialog.afterOpened.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isModalOpened$.next(true);
    });

    this.dialog.afterAllClosed.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isModalOpened$.next(false);
    });

    // Enable the inventaire form as soon as we have received the minimal info
    forkJoin(
      this.entitiesStoreService.getInventaireEntities$().pipe(first()),
      isInitialDonneeDonneeActive$
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.creationModeService.setInventaireEnabled(true);
      });

    // Enable the donnee form as soon as we have received the minimal info
    forkJoin(
      this.entitiesStoreService.getDonneeEntities$().pipe(first()),
      isInitialDonneeDonneeActive$
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(([isDonneeReady, enableDonneeForm]) => {
        this.creationModeService.setDonneeEnabled(enableDonneeForm);
      });
  }

  public ngOnDestroy(): void {
    this.creationCacheService.deleteCurrentContext();
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onSaveButtonClicked = (): void => {
    if (!this.isSaveButtonDisabled()) {
      if (this.isEditingInventaireOnly()) {
        this.onSaveInventaireButtonClicked();
      } else if (this.isEditingDonneeOnly()) {
        this.onSaveDonneeButtonClicked();
      } else if (this.isEditingBothInventaireAndDonnee()) {
        this.onSaveInventaireAndDonneeButtonClicked();
      }
    }
  };

  /**
   * Called when clicking on "Enregistrer la fiche inventaire" button
   */
  private onSaveInventaireButtonClicked = (): void => {
    this.creationPageService.updateInventaire(this.inventaireForm);
  };

  /**
   * Called when clicking on "Enregistrer la fiche espèce" button
   */
  private onSaveDonneeButtonClicked = (): void => {
    this.creationPageService.createDonnee(
      this.inventaireForm,
      this.donneeForm,
      this.clearDonnee$
    );
  };

  /**
   * Called when clicking on "Mettre à jour les fiches inventaire et espèce"
   */
  private onSaveInventaireAndDonneeButtonClicked = (): void => {
    this.creationPageService
      .isInventaireUpdated(this.inventaireForm)
      .subscribe((isInventaireUpdated) => {
        isInventaireUpdated
          ? this.openInventaireDialog()
          : this.creationPageService.updateInventaireAndDonnee(
              this.inventaireForm,
              this.donneeForm,
              false
            );
      });
  };

  private openInventaireDialog = (): void => {
    const ALL_DONNEES_OPTION = 1;
    const ONLY_CURRENT_DONNEE_OPTION = 2;
    const dialogRef = this.dialog.open(MultipleOptionsDialogComponent, {
      width: "800px",
      data: getUpdateInventaireDialogData(
        ALL_DONNEES_OPTION,
        ONLY_CURRENT_DONNEE_OPTION
      )
    });

    dialogRef.afterClosed().subscribe((option) => {
      if (
        option === ALL_DONNEES_OPTION ||
        option === ONLY_CURRENT_DONNEE_OPTION
      ) {
        const shouldCreateNewInventaire = option === ONLY_CURRENT_DONNEE_OPTION;
        this.creationPageService.updateInventaireAndDonnee(
          this.inventaireForm,
          this.donneeForm,
          shouldCreateNewInventaire
        );
      }
    });
  };

  /**
   * Called when clicking on "Donnee précédente" button
   */
  public onPreviousDonneeBtnClicked = (): void => {
    this.creationPageService.displayPreviousDonnee(
      this.inventaireForm,
      this.donneeForm
    );
  };

  /**
   * Called when clicking on "Donnée suivante" button
   */
  public onNextDonneeBtnClicked = (): void => {
    this.creationPageService.displayNextDonnee();
  };

  /**
   * Called when clicking on "Retour à l'édition de la donnée courante" button
   */
  public onBackToCurrentEditionButtonClicked = (): void => {
    this.creationPageService.backToCurrentEdition();
  };

  /**
   * Called when clicking on "Vider le formulaire" button
   */
  public onClearFormButtonClicked = (): void => {
    this.creationPageService.resetCurrentEdition();
  };

  /**
   * Called when clicking on "Supprimer la fiche espèce" button
   */
  public onDeleteDonneeBtnClicked = (): void => {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "450px",
      data: getDeleteDonneeDialogData()
    });

    dialogRef.afterClosed().subscribe((shouldDeleteDonnee) => {
      if (shouldDeleteDonnee) {
        this.creationPageService.deleteCurrentDonnee();
      }
    });
  };

  /**
   * Called when clicking on "Créer une nouvelle fiche espèce" button
   * Should switch to inventaire mode and reset the current inventaire ID to null
   * But should do not reset the form fields
   */
  public onNewInventaireBtnClicked = (): void => {
    this.creationPageService.createNewInventaire(this.inventaireForm);
  };

  /**
   * Called when clicking on "Corriger la fiche inventaire actuelle" button
   */
  public onEditInventaireBtnClicked = (): void => {
    this.creationPageService.editCurrentInventaire();
  };

  /**
   * Called when clicking on "Recherche par ID" button
   */
  public onSearchByIdBtnClicked = (): void => {
    const dialogRef = this.dialog.open(SearchByIdDialogComponent, {
      width: "450px"
    });

    dialogRef.afterClosed().subscribe((donneeId: number) => {
      if (donneeId) {
        this.creationPageService.displayDonneeByIdAndSaveCurrentCache(
          this.inventaireForm,
          this.donneeForm,
          donneeId
        );
      }
    });
  };

  public getDisplayedDonneeId$ = (): Observable<number> => {
    return this.donneeService.getDisplayedDonneeId$();
  };

  public getCurrentDonneeIndex$ = (): Observable<number> => {
    return this.donneeService.getCurrentDonneeIndex$();
  };

  public getCoordinatesSystem$ = (): Observable<CoordinatesSystem> => {
    return this.coordinatesSystem$.pipe(
      map((system) => COORDINATES_SYSTEMS_CONFIG[system])
    );
  };

  public isCurrentDonneeAnExistingOne$(): Observable<boolean> {
    return this.donneeService.isCurrentDonneeAnExistingOne$();
  }

  public isPreviousDonneeBtnDisplayed$(): Observable<boolean> {
    return combineLatest(
      this.donneeService.getIsDonneeCallOngoing$(),
      this.donneeService.hasPreviousDonnee$(),
      (ongoingCall, hasPreviousDonnee) => {
        return !ongoingCall && hasPreviousDonnee;
      }
    );
  }

  public isNextDonneeBtnDisplayed$(): Observable<boolean> {
    return combineLatest(
      this.donneeService.getIsDonneeCallOngoing$(),
      this.donneeService.hasNextDonnee$(),
      (ongoingCall, hasNextDonnee) => {
        return !ongoingCall && hasNextDonnee;
      }
    );
  }

  public getSaveButtonTooltip = (): string => {
    if (this.isEditingInventaireOnly()) {
      return "Enregistrer la fiche inventaire";
    }
    if (this.isEditingDonneeOnly()) {
      return "Enregistrer la fiche espèce";
    }
    if (this.isEditingBothInventaireAndDonnee()) {
      return "Mettre à jour les fiches inventaire et espèce";
    }
  };

  public isSaveButtonDisabled = (): boolean => {
    if (this.isEditingInventaireOnly()) {
      return !this.inventaireForm.valid;
    }
    if (this.isEditingDonneeOnly()) {
      return !this.donneeForm.valid;
    }
    if (this.isEditingBothInventaireAndDonnee()) {
      return !this.inventaireForm.valid || !this.donneeForm.valid;
    }
  };

  private isEditingInventaireOnly = (): boolean => {
    return this.inventaireForm.enabled && this.donneeForm.disabled;
  };

  public isEditingDonneeOnly = (): boolean => {
    return this.inventaireForm.disabled && this.donneeForm.enabled;
  };

  private isEditingBothInventaireAndDonnee = (): boolean => {
    return this.inventaireForm.enabled && this.donneeForm.enabled;
  };
}
