import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
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

  map,
  take,
  takeUntil,
  tap,
  withLatestFrom
} from "rxjs/operators";
import { Commune, Departement, LieuDit, Meteo, Observateur, Settings } from "src/app/model/graphql";
import { Donnee } from 'src/app/model/types/donnee.object';
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

type CreationQueryResult = {
  communes: Commune[];
  departements: Departement[],
  lieuxDits: LieuDit[];
  meteos: Meteo[];
  observateurs: Observateur[];
  settings: Settings;
}

const CREATION_QUERY = gql`
  query {
    communes {
      id
      code
      nom
      departementId
    }
    departements {
      id
      code
    }
    lieuxDits {
      id
      nom
      altitude
      longitude
      latitude
      coordinatesSystem
      communeId
    }
    meteos {
      id
      libelle
    }
    observateurs {
      id
      libelle
    }
    settings {
      id
      areAssociesDisplayed
      isDistanceDisplayed
      isMeteoDisplayed
      isRegroupementDisplayed
      defaultDepartement {
        id
        code
      }
      defaultObservateur {
        id
        libelle
      }
      coordinatesSystem
      defaultEstimationNombre {
        id
        libelle
        nonCompte
      }
      defaultSexe {
        id
        libelle
      }
      defaultAge {
        id
        libelle
      }
      defaultNombre
    }
  }
`;

@Component({
  styleUrls: ["./creation.component.scss"],
  templateUrl: "./creation.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreationComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly destroy$ = new Subject();

  @ViewChildren("especeInput") especeInput: QueryList<ElementRef>;

  private requestedDonneeId: number;

  public observateurs$: Observable<Observateur[]>;

  public appConfiguration$: Observable<Settings>;

  public inventaireForm: FormGroup;

  public donneeForm: FormGroup;

  private clearDonnee$: Subject<Donnee> = new Subject<Donnee>();

  private isInitialDonneeDonneeActive$ = new BehaviorSubject<boolean>(null);

  public isInitializationCompleted$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  public isPreviousDonneeBtnDisplayed$: Observable<boolean>;

  public isNextDonneeBtnDisplayed$: Observable<boolean>;

  private isModalOpened$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  public lieuditMapClicked$ = new Subject();

  public lieuditMapRequested$ = new BehaviorSubject<boolean>(false);

  public isLieuditMapDisplayed$: Observable<boolean>;

  public fxDistance$: BehaviorSubject<string> = new BehaviorSubject("");

  public fxRegroupement$: BehaviorSubject<string> = new BehaviorSubject("");

  constructor(
    private apollo: Apollo,
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
  }

  public ngOnInit(): void {

    const queryResult$ = this.apollo.watchQuery<CreationQueryResult>({
      query: CREATION_QUERY
    }).valueChanges.pipe(
      takeUntil(this.destroy$),
      filter(result => !!result.data),
      map(({ data }) => {
        return data;
      })
    );

    this.observateurs$ = queryResult$.pipe(map((data) => data?.observateurs));

    this.appConfiguration$ = queryResult$.pipe(map((data) => data?.settings));

    this.appConfiguration$.subscribe((configuration) => {
      this.fxDistance$.next(configuration?.isRegroupementDisplayed ? "auto" : "0 0 50%");
      this.fxRegroupement$.next(configuration?.isDistanceDisplayed ? "1 0 220px" : "0 0 250px");
    })

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
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.onSaveButtonClicked();
      });

    // If a specific id was requested, retrieve it
    let initialDonnee$: Observable<boolean>;
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
      this.isInitialDonneeDonneeActive$.next(isInitialDonneeDonneeActive);
      this.isInitialDonneeDonneeActive$.complete();
    });

    // Update the coordinates form controls depending on the application coordinates system
    this.appConfiguration$
      .pipe(
        takeUntil(this.destroy$),
        map(settings => settings?.coordinatesSystem)
      )
      .subscribe((coordinatesSystemType) => {
        this.coordinatesBuilderService.updateCoordinatesValidators(
          coordinatesSystemType,
          (this.inventaireForm.controls.lieu as FormGroup).controls.longitude,
          (this.inventaireForm.controls.lieu as FormGroup).controls.latitude
        );
      });

    combineLatest(
      [
        queryResult$,
        this.donneeService.getCurrentDonnee$()
      ]
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(([queryResult, donnee]) => {
        this.inventaireFormService.updateForm(
          this.inventaireForm,
          queryResult,
          donnee?.inventaire,
        );
      });

    combineLatest(
      [
        this.entitiesStoreService.getDonneeEntities$(),
        this.donneeService.getCurrentDonnee$(),
        this.appConfiguration$
      ]
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

    this.dialog.afterOpened.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isModalOpened$.next(true);
    });

    this.dialog.afterAllClosed.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isModalOpened$.next(false);
    });

    // Enable the inventaire form as soon as we have received the minimal info
    forkJoin([
      queryResult$.pipe(take(1)),
      this.isInitialDonneeDonneeActive$
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.creationModeService.setInventaireEnabled(true);
      });

    // Enable the donnee form as soon as we have received the minimal info
    forkJoin([
      this.entitiesStoreService.getDonneeEntities$().pipe(take(1)),
      this.isInitialDonneeDonneeActive$
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([isDonneeReady, enableDonneeForm]) => {
        this.creationModeService.setDonneeEnabled(enableDonneeForm);
      });

    // Set the initialization as completed once we received everything we need
    forkJoin([
      queryResult$.pipe(take(1)),
      this.entitiesStoreService.getDonneeEntities$().pipe(take(1)),
      this.isInitialDonneeDonneeActive$
    ])
      .pipe(
        takeUntil(this.destroy$),
        map(() => true)
      )
      .subscribe(() => {
        // Cannot subscribe directly as we need to keep 
        // the initialization state for the duration of the component
        this.isInitializationCompleted$.next(true);
      });

    // Handle the state of the previous donnee button
    this.isPreviousDonneeBtnDisplayed$ = combineLatest(
      [
        this.donneeService.getIsDonneeCallOngoing$(),
        this.donneeService.hasPreviousDonnee$(),
        this.isInitializationCompleted$
      ]).pipe(
        takeUntil(this.destroy$),
        map(([ongoingCall, hasPreviousDonnee, isInitializationCompleted]) => {
          return !ongoingCall && hasPreviousDonnee && isInitializationCompleted;
        })
      );

    // Handle the state of the next donnee button
    this.isNextDonneeBtnDisplayed$ = combineLatest(
      [
        this.donneeService.getIsDonneeCallOngoing$(),
        this.donneeService.hasNextDonnee$(),
        this.isInitializationCompleted$
      ]).pipe(
        takeUntil(this.destroy$),
        map(([ongoingCall, hasNextDonnee, isInitializationCompleted]) => {
          return !ongoingCall && hasNextDonnee && isInitializationCompleted;
        })
      );

    // Toggle the map display when clicked
    this.lieuditMapClicked$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.lieuditMapRequested$.next(!this.lieuditMapRequested$.value);
      });

    // When the inventaire becomes disabled, hide the map
    this.creationModeService.getStatus$()
      .pipe(
        map((status) => status.isInventaireEnabled),
        filter(isInventaireEnabled => !isInventaireEnabled),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.lieuditMapRequested$.next(false));

    // The map can be displayed IF AND ONLY IF it is "requested" (i.e the user wants to display it)
    // and the inventaire is active
    this.isLieuditMapDisplayed$ = combineLatest([this.lieuditMapRequested$, this.creationModeService.getStatus$()])
      .pipe(
        map(([isLieuditMapRequested, status]) => isLieuditMapRequested && status.isInventaireEnabled),
        takeUntil(this.destroy$)
      );
  }

  public ngAfterViewInit(): void {
    this.creationModeService.getStatus$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        const elementToFocus =
          status.isDonneeEnabled && !status.isInventaireEnabled
            ? "input-Espèce"
            : "input-Observateur";
        document.getElementById(elementToFocus)?.focus();
      });

    // Detect when the input espece is to be displayed
    // to set the focus on it if needed
    // There are cases where it is not properly handled as per above,
    // as it will be triggered before the component exists (because of the ngIf)
    this.especeInput.changes
      .pipe(
        filter(changes => changes.length),
        withLatestFrom(this.creationModeService.getStatus$()),
        map(([changes, status]) => status),
        filter((status) => {
          return status.isDonneeEnabled && !status.isInventaireEnabled;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        document.getElementById("input-Espèce")?.focus();
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
   * Called when clicking on "Ajouter une nouvelle fiche espèce à cet inventaire" button
   */
  public onAddADonneeToThisInventaireButtonClicked = (): void => {
    this.creationPageService.addADonneeToAnExistingInventaire(
      this.inventaireForm
    );
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
        this.creationPageService
          .displayDonneeByIdAndSaveCurrentCache(
            this.inventaireForm,
            this.donneeForm,
            donneeId
          )
          .subscribe();
      }
    });
  };

  public getDisplayedDonneeId$ = (): Observable<number> => {
    return this.donneeService.getDisplayedDonneeId$();
  };

  public getCurrentDonneeIndex$ = (): Observable<number> => {
    return this.donneeService.getCurrentDonneeIndex$();
  };

  public isCurrentDonneeAnExistingOne$(): Observable<boolean> {
    return this.donneeService.isCurrentDonneeAnExistingOne$();
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

  public isDistanceFieldInvalid = (): boolean => {
    return (this.donneeForm.controls
      .distanceGroup as FormGroup).controls.distance.hasError("forbiddenValue");
  };

  public isNombreFieldInvalid = (): boolean => {
    return (this.donneeForm.controls
      .nombreGroup as FormGroup).controls.nombre.hasError("forbiddenValue");
  };

  public toggleSearchInMap = (): void => {
    this.lieuditMapClicked$.next();
  }

}
