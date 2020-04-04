import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Classe } from "ouca-common/classe.object";
import { Commune } from "ouca-common/commune.object";
import {
  CoordinatesSystem,
  CoordinatesSystemType,
  COORDINATES_SYSTEMS_CONFIG,
} from "ouca-common/coordinates-system";
import { CreationPage } from "ouca-common/creation-page.object";
import { Departement } from "ouca-common/departement.object";
import { Donnee } from "ouca-common/donnee.object";
import { Espece } from "ouca-common/espece.object";
import { Inventaire } from "ouca-common/inventaire.object";
import { Lieudit } from "ouca-common/lieudit.object";
import { PostResponse } from "ouca-common/post-response.object";
import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { BackendApiService } from "src/app/services/backend-api.service";
import { CoordinatesService } from "src/app/services/coordinates.service";
import { CreationModeService } from "src/app/services/creation-mode.service";
import { RegroupementService } from "src/app/services/regroupement.service";
import { CreationPageService } from "../../../../services/creation-page.service";
import { DonneeService } from "../../../../services/donnee.service";
import { InventaireService } from "../../../../services/inventaire.service";
import { StatusMessageService } from "../../../../services/status-message.service";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { MultipleOptionsDialogComponent } from "../../../shared/components/multiple-options-dialog/multiple-options-dialog.component";
import { SearchByIdDialogComponent } from "../../components/search-by-id-dialog/search-by-id-dialog.component";
import {
  getDeleteDonneeDialogData,
  getUpdateInventaireDialogData,
} from "../../helpers/creation-dialog.helper";
import { InventaireHelper } from "../../helpers/inventaire.helper";

@Component({
  styleUrls: ["./creation.component.scss"],
  templateUrl: "./creation.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreationComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();

  public pageModel$: Observable<CreationPage>;

  public nextRegroupement$: Subject<number> = new Subject<number>();

  public departements$: Observable<Departement[]>;

  public communes$: Observable<Commune[]>;

  public lieuxdits$: Observable<Lieudit[]>;

  public classes$: Observable<Classe[]>;

  public especes$: Observable<Espece[]>;

  public inventaireForm: FormGroup;

  public donneeForm: FormGroup;

  private requestedDonneeId: number;

  private coordinatesSystem$: Observable<CoordinatesSystemType>;

  private isModalOpened$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  private currentModeStatus$: BehaviorSubject<{
    isInventaireEnabled: boolean;
    isDonneeEnabled: boolean;
  }> = new BehaviorSubject<{
    isInventaireEnabled: boolean;
    isDonneeEnabled: boolean;
  }>(null);

  constructor(
    private backendApiService: BackendApiService,
    private coordinatesService: CoordinatesService,
    private dialog: MatDialog,
    private router: Router,
    private creationPageService: CreationPageService,
    private inventaireService: InventaireService,
    private donneeService: DonneeService,
    private creationModeService: CreationModeService,
    private regroupementService: RegroupementService,
    private statusMessageService: StatusMessageService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (
      navigation.extras &&
      navigation.extras.state &&
      (navigation.extras.state as { id: number }).id
    ) {
      this.requestedDonneeId = (navigation.extras.state as { id: number }).id;
    }
  }

  public ngOnInit(): void {
    // Create the inventaire form group
    this.inventaireForm = this.inventaireService.createInventaireForm();

    // Update the coordinates form controls depending on the application coordinates system
    this.coordinatesService
      .getAppCoordinatesSystem$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((coordinatesSystemType) => {
        this.coordinatesService.updateCoordinatesValidators(
          coordinatesSystemType,
          (this.inventaireForm.controls.lieu as FormGroup).controls.longitude,
          (this.inventaireForm.controls.lieu as FormGroup).controls.latitude
        );
      });

    // Create the donnee form
    this.donneeForm = this.donneeService.createDonneeForm();

    // Map all observables of the page
    this.pageModel$ = this.creationPageService
      .getCreationPage$()
      .pipe(takeUntil(this.destroy$));

    this.communes$ = this.pageModel$.pipe(
      map((pageModel) => {
        return pageModel ? pageModel.communes : [];
      })
    );

    this.departements$ = this.pageModel$.pipe(
      map((pageModel) => {
        return pageModel ? pageModel.departements : [];
      })
    );

    this.lieuxdits$ = this.pageModel$.pipe(
      map((pageModel) => {
        return pageModel ? pageModel.lieudits : [];
      })
    );

    this.classes$ = this.pageModel$.pipe(
      map((pageModel) => {
        return pageModel ? pageModel.classes : [];
      })
    );

    this.especes$ = this.pageModel$.pipe(
      map((pageModel) => {
        return pageModel ? pageModel.especes : [];
      })
    );

    this.coordinatesSystem$ = this.pageModel$.pipe(
      map((model) => model.coordinatesSystem)
    );

    const requestedDonneeId = this.requestedDonneeId;
    this.requestedDonneeId = null;
    this.pageModel$.subscribe((creationPage: CreationPage) => {
      this.onInitCreationPage(creationPage, requestedDonneeId);
    });

    combineLatest(this.pageModel$, this.donneeService.getCurrentDonnee$())
      .pipe(takeUntil(this.destroy$))
      .subscribe(([pageModel, donnee]) => {
        console.log("La donnée courante a changé", donnee);

        this.donneeService.setDonneeFormFromDonnee(
          pageModel,
          this.donneeForm,
          donnee
        );
        this.inventaireService.setInventaireFormFromInventaire(
          pageModel,
          this.inventaireForm,
          donnee?.inventaire
        );

        this.inventaireService.setDisplayedInventaireId(donnee?.inventaireId);
        // this.donneeService.setDisplayedDonneeId(donnee?.id); // TO DO
      });

    this.regroupementService
      .getNextRegroupement$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((nextRegroupement) => {
        this.nextRegroupement$.next(nextRegroupement);
      });

    this.creationModeService
      .getStatus$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        this.currentModeStatus$.next(status);

        this.inventaireForm.disable();
        this.donneeForm.disable();

        if (status.isInventaireEnabled) {
          this.inventaireForm.enable();
        }

        if (status.isDonneeEnabled) {
          this.donneeForm.enable();
        }

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

    /**
     * Called when launching the page
     * Call the back-end to get the initial creation page model
     */
    this.creationPageService.initializeCreationPage();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * If back-end call is successful, use the initial creation page model to build the page
   * @param creationPage: CreationPage
   */
  private onInitCreationPage(
    creationPage: CreationPage,
    requestedDonneeId: number
  ): void {
    if (creationPage?.observateurs) {
      this.nextRegroupement$.next(creationPage.nextRegroupement);
      this.donneeService.initialize(creationPage?.lastDonnee?.id);

      // If the user navigated to this page with a defined id, retrieve this id
      if (requestedDonneeId != null) {
        this.donneeService.getDonneeById(requestedDonneeId);
      } else {
        // Otherwise call, the normal initialization of the page
        this.creationModeService.setStatus(true, false);
      }
    } else {
      this.statusMessageService.showErrorMessage(
        "Impossible de charger le contenu la page de Saisie des observations."
      );
    }
  }

  /**
   * Called when clicking on Save Inventaire button
   */
  public onSaveInventaireButtonClicked(): void {
    if (this.inventaireService.getDisplayedInventaireId()) {
      // Update the existing inventaire and switch to donnee mode
      this.saveInventaire();
    } else {
      // Wait until first donnee is created to create the inventaire
      // Switch to donnee mode
      this.creationModeService.setStatus(false, true);
    }
  }

  private saveInventaire(saveDonneeAfterInventaire?: boolean): void {
    const inventaireToBeSaved: Inventaire = this.inventaireService.getInventaireFromInventaireForm(
      this.inventaireForm
    );

    this.backendApiService
      .saveInventaire(inventaireToBeSaved)
      .subscribe((response: PostResponse) => {
        if (response.isSuccess) {
          this.onCreateInventaireSuccess(
            response.insertId,
            saveDonneeAfterInventaire
          );
        } else {
          this.statusMessageService.showErrorMessage(
            "Une erreur est survenue pendant la sauvegarde de l'inventaire: " +
              response.message
          );
        }
      });
  }

  private onCreateInventaireSuccess(
    savedId: number,
    saveDonnee?: boolean
  ): void {
    this.statusMessageService.showSuccessMessage(
      "La fiche inventaire a été sauvegardée avec succès."
    );

    // To know if we were updating an existing inventaire
    const oldInventaireId: number = this.inventaireService.getDisplayedInventaireId();

    if (savedId) {
      // The inventaire ID has been created or updated, we display it
      this.inventaireService.setDisplayedInventaireId(savedId);
    }

    if (saveDonnee) {
      this.createDonnee();
    } else if (oldInventaireId) {
      // We were updating an existing inventaire, we switch to donnee mode
      this.creationModeService.setStatus(false, true);
    }
  }

  /**
   * Called when clicking on Save Donnee button
   */
  public onSaveDonneeButtonClicked(): void {
    if (this.inventaireService.getDisplayedInventaireId()) {
      // Check if the inventaire still exists in the database
      this.backendApiService
        .getInventaireIdById(this.inventaireService.getDisplayedInventaireId())
        .subscribe((responseId: number) => {
          if (!responseId) {
            // The inventaire is not yet saved, we create both the inventaire and donnee
            this.inventaireService.setDisplayedInventaireId(null);
            this.saveInventaire(true);
          } else {
            // The inventaire is already saved, we only create the donnee
            this.createDonnee();
          }
        });
    } else {
      // The inventaire is not yet saved, we create both the inventaire and donnee
      this.saveInventaire(true);
    }
  }

  private createDonnee(): void {
    const donnee: Donnee = this.donneeService.getDonneeFromDonneeForm(
      this.donneeForm
    );
    this.creationPageService.saveDonnne(donnee);

    this.backendApiService
      .saveDonnee(donnee)
      .subscribe((response: PostResponse) => {
        if (response.isSuccess) {
          if (!donnee.id) {
            donnee.id = response.insertId;
          }
          this.onSaveDonneeSuccess(donnee);
        } else {
          this.statusMessageService.showErrorMessage(response.message);
        }
      });
  }

  private onSaveDonneeSuccess(savedDonnee: Donnee): void {
    this.statusMessageService.showSuccessMessage(
      "La fiche espèce a été créée avec succès."
    );

    savedDonnee.inventaire = this.inventaireService.getInventaireFromInventaireForm(
      this.inventaireForm
    );
    this.regroupementService.updateNextRegroupement();
    this.donneeService.initializeDonneeForm(null, this.donneeForm); // TODO
    document.getElementById("input-Espèce").focus();
  }

  /**
   * Called when clicking on save donnee when in update mode
   */
  public saveInventaireAndDonnee(): void {
    const inventaireToSave: Inventaire = this.inventaireService.getInventaireFromInventaireForm(
      this.inventaireForm
    );

    this.backendApiService
      .getInventaireById(this.inventaireService.getDisplayedInventaireId())
      .subscribe((result) => {
        if (InventaireHelper.isInventaireUpdated(result, inventaireToSave)) {
          this.displayInventaireDialog();
        } else {
          this.updateInventaireAndDonnee(false);
        }
      });
  }

  private displayInventaireDialog(): void {
    const ALL_DONNEES_OPTION = 1;
    const ONLY_CURRENT_DONNEE_OPTION = 2;
    const dialogRef = this.dialog.open(MultipleOptionsDialogComponent, {
      width: "800px",
      data: getUpdateInventaireDialogData(
        ALL_DONNEES_OPTION,
        ONLY_CURRENT_DONNEE_OPTION
      ),
    });

    dialogRef.afterClosed().subscribe((option) => {
      if (option === ALL_DONNEES_OPTION) {
        // We just update the existing inventaire
        this.updateInventaireAndDonnee(false);
      } else if (option === ONLY_CURRENT_DONNEE_OPTION) {
        // We create a new inventaire for this donnee
        this.updateInventaireAndDonnee(true);
      }
    });
  }

  /**
   * Calls the backend to update the fiche inventaire and fiche espece
   * If the user wants to update the fiche inventaire only for this fiche
   * espece then we create a new inventaire
   * If the fiche inventaire already exists with another ID we remove the
   * current inventaire to keep only the existing one
   * @param createNewInventaire If we should create a new inventaire for the
   * donnee or just update it for all its donnees
   */
  private updateInventaireAndDonnee(createNewInventaire: boolean): void {
    const inventaireToSave: Inventaire = this.inventaireService.getInventaireFromInventaireForm(
      this.inventaireForm
    );
    if (createNewInventaire) {
      inventaireToSave.id = null;
    }

    const donneeToSave: Donnee = this.donneeService.getDonneeFromDonneeForm(
      this.donneeForm
    );
    donneeToSave.inventaireId = inventaireToSave.id;

    this.backendApiService
      .saveInventaire(inventaireToSave)
      .subscribe((response: PostResponse) => {
        if (response.isSuccess) {
          if (response.insertId) {
            donneeToSave.inventaireId = response.insertId;
            this.inventaireService.setDisplayedInventaireId(response.insertId);
          }

          this.backendApiService
            .saveDonnee(donneeToSave)
            .subscribe((response: PostResponse) => {
              if (response.isSuccess) {
                this.statusMessageService.showSuccessMessage(
                  "La fiche espèce et sa fiche inventaire ont été mises à jour avec succès."
                );
                this.regroupementService.updateNextRegroupement();
                // TO DO update next and previous donnee
              } else {
                this.statusMessageService.showErrorMessage(
                  "Une erreur est survenue pendant la sauvegarde de la fiche espèce: " +
                    response.message
                );
              }
            });
        } else {
          this.statusMessageService.showErrorMessage(
            "Une erreur est survenue pendant la sauvegarde de la fiche inventaire:" +
              response.message
          );
        }
      });
  }

  /**
   * Called when clicking on "Donnee précédente" button
   */
  public onPreviousDonneeBtnClicked(): void {
    this.donneeService.getPreviousDonnee(this.inventaireForm, this.donneeForm);
  }

  /**
   * Called when clicking on "Donnée suivante" button
   */
  public onNextDonneeBtnClicked = (): void => {
    this.donneeService.getNextDonnee();
  };

  /**
   * Called when clicking on "Supprimer la fiche espèce" button
   */
  public onDeleteDonneeBtnClicked = (): void => {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "450px",
      data: getDeleteDonneeDialogData(),
    });

    dialogRef.afterClosed().subscribe((shouldDeleteDonnee) => {
      if (shouldDeleteDonnee) {
        this.donneeService.deleteCurrentDonnee();
      }
    });
  };

  /**
   * When clicking on New Inventaire button
   * we switch to inventaire mode and reset the current inventaire ID to null
   * but we do not reset the form fields
   */
  public onNewInventaireBtnClicked = (): void => {
    this.inventaireService.setDisplayedInventaireId(null); // TO DO
    this.creationModeService.setStatus(true, false);
  };

  public onEditInventaireBtnClicked = (): void => {
    this.creationModeService.setStatus(true, false);
  };

  public onNewDonneeBtnClicked = (): void => {
    this.creationModeService.setStatus(true, false);
  };

  public onSearchByIdBtnClicked = (): void => {
    const dialogRef = this.dialog.open(SearchByIdDialogComponent, {
      width: "450px",
    });

    dialogRef.afterClosed().subscribe((donneeId: number) => {
      if (donneeId) {
        this.donneeService.getDonneeById(donneeId);
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

  public isNewInventaireBtnDisplayed$(): Observable<boolean> {
    return this.creationModeService.isDonneeOnlyEnabled$();
  }

  public isUpdateInventaireBtnDisplayed$(): Observable<boolean> {
    return this.creationModeService.isDonneeOnlyEnabled$();
  }

  public isSaveInventaireBtnDisplayed$ = (): Observable<boolean> => {
    return this.creationModeService.isInventaireOnlyEnabled$();
  };

  public isUpdateDonneeBtnDisplayed$(): Observable<boolean> {
    return this.donneeService.isCurrentDonneeAnExistingOne$();
  }

  public isSaveDonneeBtnDisplayed$(): Observable<boolean> {
    return this.creationModeService.isDonneeOnlyEnabled$();
  }

  public isNewDonneeBtnDisplayed$(): Observable<boolean> {
    return this.donneeService.isCurrentDonneeAnExistingOne$();
  }

  public isDeleteDonneeBtnDisplayed$(): Observable<boolean> {
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

  /**
   * When clicking on Enter, we save the inventaire or donnee
   * if it is valid
   * and if the focus is not on a textarea field which can contain several lines
   */
  @HostListener("document:keyup", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (
      event.key === "Enter" &&
      document.activeElement.tagName.toLowerCase() !== "textarea" &&
      !this.isModalOpened$.value
    ) {
      if (
        this.currentModeStatus$.value?.isInventaireEnabled &&
        !this.currentModeStatus$.value?.isDonneeEnabled &&
        this.inventaireForm.valid
      ) {
        this.onSaveInventaireButtonClicked();
      } else if (
        !this.currentModeStatus$.value?.isInventaireEnabled &&
        this.currentModeStatus$.value?.isDonneeEnabled &&
        this.donneeForm.valid
      ) {
        this.onSaveDonneeButtonClicked();
      } else if (
        this.currentModeStatus$.value?.isInventaireEnabled &&
        this.currentModeStatus$.value?.isDonneeEnabled &&
        this.inventaireForm.valid &&
        this.donneeForm.valid
      ) {
        this.saveInventaireAndDonnee();
      }
    }
  }
}
