import { ChangeDetectionStrategy, Component, HostListener, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Classe } from "ouca-common/classe.object";
import { Commune } from "ouca-common/commune.object";
import { CoordinatesSystem, CoordinatesSystemType, COORDINATES_SYSTEMS_CONFIG } from "ouca-common/coordinates-system";
import { CreationPage } from "ouca-common/creation-page.object";
import { Departement } from "ouca-common/departement.object";
import { DonneeWithNavigationData } from "ouca-common/donnee-with-navigation-data.object";
import { Donnee } from "ouca-common/donnee.object";
import { Espece } from "ouca-common/espece.object";
import { Inventaire } from "ouca-common/inventaire.object";
import { Lieudit } from "ouca-common/lieudit.object";
import { PostResponse } from "ouca-common/post-response.object";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { CreationPageService } from "../../../../services/creation-page.service";
import { DonneeService } from "../../../../services/donnee.service";
import { InventaireService } from "../../../../services/inventaire.service";
import { StatusMessageService } from "../../../../services/status-message.service";
import { ConfirmationDialogData } from "../../../shared/components/confirmation-dialog/confirmation-dialog-data.object";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { MultipleOptionsDialogData } from "../../../shared/components/multiple-options-dialog/multiple-options-dialog-data.object";
import { MultipleOptionsDialogComponent } from "../../../shared/components/multiple-options-dialog/multiple-options-dialog.component";
import { BackendApiService } from "../../../shared/services/backend-api.service";
import { SearchByIdDialogComponent } from "../../components/search-by-id-dialog/search-by-id-dialog.component";
import { CreationModeEnum } from "../../helpers/creation-mode.enum";
import { DonneeHelper } from "../../helpers/donnee.helper";
import { InventaireHelper } from "../../helpers/inventaire.helper";
import { CreationModeService } from "../../services/creation-mode.service";
import { NavigationService } from "../../services/navigation.service";

@Component({
  styleUrls: ["./creation.component.scss"],
  templateUrl: "./creation.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreationComponent implements OnInit {
  public pageModel$: Observable<CreationPage>;

  public nextRegroupement$: Subject<number> = new Subject<number>();

  public departements$: Observable<Departement[]>;

  public communes$: Observable<Commune[]>;

  public lieuxdits$: Observable<Lieudit[]>;

  public classes$: Observable<Classe[]>;

  public especes$: Observable<Espece[]>;

  public inventaireForm: FormGroup;

  public donneeForm: FormGroup;

  private requestedEspeceId: number;

  private coordinatesSystem$: Observable<CoordinatesSystemType>;

  constructor(
    private backendApiService: BackendApiService,
    private dialog: MatDialog,
    private navigationService: NavigationService,
    private router: Router,
    private creationPageService: CreationPageService,
    private inventaireService: InventaireService,
    private donneeService: DonneeService,
    private creationModeService: CreationModeService,
    private statusMessageService: StatusMessageService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (
      navigation.extras &&
      navigation.extras.state &&
      (navigation.extras.state as { id: number }).id
    ) {
      this.requestedEspeceId = (navigation.extras.state as { id: number }).id;
    }
  }

  public ngOnInit(): void {
    this.inventaireForm = this.inventaireService.createInventaireForm();
    this.donneeForm = this.donneeService.createDonneeForm();
    this.pageModel$ = this.creationPageService.getCreationPage$();

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

    /**
     * Called when launching the page
     * Call the back-end to get the initial creation page model
     */
    this.creationPageService.initializeCreationPage();

    const requestedEspeceId = this.requestedEspeceId;
    this.requestedEspeceId = null;
    this.pageModel$.subscribe((creationPage: CreationPage) => {
      this.onInitCreationPageUpdate(creationPage, requestedEspeceId);
    });
  }

  private displayDonneeById = (idToFind: number): void => {
    this.backendApiService
      .getDonneeByIdWithContext(idToFind)
      .subscribe((donnee: DonneeWithNavigationData) => {
        if (donnee && donnee.inventaireId) {
          this.inventaireService.setInventaireFormFromInventaire(
            this.inventaireForm,
            donnee.inventaire
          );
          this.donneeService.setDonneeFormFromDonnee(this.donneeForm, donnee);
          this.switchToUpdateMode();
          this.navigationService.updateNavigationAfterSearchDonneeById(
            donnee.indexDonnee,
            donnee.previousDonneeId,
            donnee.nextDonneeId
          );
        } else {
          this.statusMessageService.showErrorMessage(
            "Aucune fiche espèce trouvée avec l'ID " + idToFind + "."
          );
        }
      });
  };

  /**
   * If back-end call is successful, use the initial creation page model to build the page
   * @param creationPage: CreationPage
   */
  private onInitCreationPageUpdate(
    creationPage: CreationPage,
    requestedEspeceId: number
  ): void {
    if (!!creationPage && !!creationPage.observateurs) {
      this.nextRegroupement$.next(creationPage.nextRegroupement);

      this.navigationService.init(
        creationPage.lastDonnee,
        creationPage.numberOfDonnees
      );

      // If the user navigated to this page with a defined id, retrieve this id
      if (requestedEspeceId != null) {
        this.displayDonneeById(requestedEspeceId);
      } else {
        // Otherwise call, the normal initialization of the page
        this.switchToNewInventaireMode();
      }
    } else {
      this.statusMessageService.showErrorMessage(
        "Impossible de charger le contenu la page de Saisie des observations."
      );
    }
  }

  /**
   * When clicking on Enter, we save the inventaire or donnee
   * if it is valid
   * and if the focus is not on a textarea field which can contain several lines
   */
  @HostListener("document:keyup", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (
      /*event.ctrlKey &&*/ event.key === "Enter" &&
      document.activeElement.tagName.toLowerCase() !== "textarea"
    ) {
      if (
        this.creationModeService.isInventaireMode() &&
        this.inventaireForm.valid
      ) {
        this.onSaveInventaireButtonClicked();
      } else if (
        this.creationModeService.isDonneeMode() &&
        this.donneeForm.valid
      ) {
        this.onSaveDonneeButtonClicked();
      } else if (
        this.creationModeService.isUpdateMode() &&
        this.inventaireForm.valid &&
        this.donneeForm.valid
      ) {
        this.saveInventaireAndDonnee();
      }
    }
  }

  /**
   * Initialize the page to be ready to create an inventaire
   */
  private switchToNewInventaireMode(): void {
    this.navigationService.resetPreviousAndNextDonnee();
    this.inventaireService.initializeInventaireForm(this.inventaireForm);
    this.donneeService.initializeDonneeForm(this.donneeForm);
    if (document.getElementById("input-Espèce")) {
      document.getElementById("input-Espèce").focus();
    }

    this.switchToInventaireMode();
  }

  public isNewInventaireBtnDisplayed$(): Observable<boolean> {
    return this.creationModeService.isDonneeMode$();
  }

  public isUpdateInventaireBtnDisplayed$(): Observable<boolean> {
    return this.creationModeService.isDonneeMode$();
  }

  public isSaveInventaireBtnDisplayed$ = (): Observable<boolean> => {
    return this.creationModeService.isInventaireMode$();
  };

  public isUpdateDonneeBtnDisplayed$(): Observable<boolean> {
    return this.creationModeService.isUpdateMode$();
  }
  public isSaveDonneeBtnDisplayed$(): Observable<boolean> {
    return this.creationModeService.isDonneeMode$();
  }

  public isNewDonneeBtnDisplayed$(): Observable<boolean> {
    return this.creationModeService.isUpdateMode$();
  }

  public isDeleteDonneeBtnDisplayed$(): Observable<boolean> {
    return this.creationModeService.isUpdateMode$();
  }

  public isPreviousDonneeBtnDisplayed$(): Observable<boolean> {
    return this.navigationService.hasPreviousDonnee$();
  }

  public isNextDonneeBtnDisplayed$(): Observable<boolean> {
    return this.navigationService.hasNextDonnee$();
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
      this.switchToEditionDonneeMode();
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
      this.switchToEditionDonneeMode();
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
    const donneeToBeSaved: Donnee = this.donneeService.getDonneeFromDonneeForm(
      this.donneeForm
    );

    this.backendApiService
      .saveDonnee(donneeToBeSaved)
      .subscribe((response: PostResponse) => {
        if (response.isSuccess) {
          if (!donneeToBeSaved.id) {
            donneeToBeSaved.id = response.insertId;
          }
          this.onSaveDonneeSuccess(donneeToBeSaved);
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
    this.navigationService.updateNavigationAfterADonneeWasCreated(savedDonnee);
    this.updateNextRegroupement();
    this.donneeService.initializeDonneeForm(this.donneeForm);
    document.getElementById("input-Espèce").focus();
  }

  /**
   * Called when a donnee is saved to get the next regroupement number
   */
  private updateNextRegroupement(): void {
    this.backendApiService
      .getNextRegroupement()
      .subscribe((regroupement: number) => {
        this.nextRegroupement$.next(regroupement);
      });
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

    const updateInventaireDialogData: MultipleOptionsDialogData = {
      title: "Confirmation de mise-à-jour",
      content:
        "Vous avez modifié la fiche inventaire. " +
        "Voulez-vous mettre à jour la fiche inventaire pour cette fiche espèce " +
        "seulement ou pour toutes les fiches espèces de cette fiche inventaire ?",
      options: [
        {
          value: ALL_DONNEES_OPTION,
          label: "Pour toutes les fiches espèces de cette fiche inventaire",
          color: "primary"
        },
        {
          value: ONLY_CURRENT_DONNEE_OPTION,
          label: "Pour cette fiche espèce seulement",
          color: "primary"
        },
        { label: "Annuler", color: "accent" }
      ]
    };
    const dialogRef = this.dialog.open(MultipleOptionsDialogComponent, {
      width: "800px",
      data: updateInventaireDialogData
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === ALL_DONNEES_OPTION) {
        // We just update the existing inventaire
        this.updateInventaireAndDonnee(false);
      } else if (result === ONLY_CURRENT_DONNEE_OPTION) {
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
                this.updateNextRegroupement();
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
   * Called when clicking on "Donnee precedente" button
   */
  public onPreviousDonneeBtnClicked(): void {
    const currentDonnee: Donnee = this.getCurrentDonneeFromForm();

    // Save the current donnee, inventaire and mode
    if (!this.creationModeService.isUpdateMode()) {
      this.saveCurrentContext(currentDonnee);
      this.switchToUpdateMode();
    }

    this.navigationService
      .getPreviousDonnee()
      .then((donnee: DonneeWithNavigationData) => {
        this.displayPreviousDonnne(donnee);

        this.navigationService.updateNavigationAfterPreviousDonneeIsDisplayed(
          donnee.previousDonneeId,
          donnee.nextDonneeId
        );
      });
  }

  private getCurrentDonneeFromForm(): Donnee {
    const currentDonnee: Donnee = this.donneeService.getDonneeFromDonneeForm(
      this.donneeForm
    );
    currentDonnee.inventaire = this.inventaireService.getInventaireFromInventaireForm(
      this.inventaireForm
    );
    return currentDonnee;
  }

  private saveCurrentContext(currentDonnee: Donnee): void {
    this.navigationService.saveCurrentContext(
      currentDonnee,
      (this.inventaireForm.controls.lieu as FormGroup).controls.departement
        .value,
      (this.inventaireForm.controls.lieu as FormGroup).controls.commune.value,
      (this.donneeForm.controls.especeGroup as FormGroup).controls.classe.value
    );
  }

  private displayPreviousDonnne(previousDonnee: Donnee): void {
    this.donneeService.setDonneeFormFromDonnee(this.donneeForm, previousDonnee);
    this.inventaireService.setInventaireFormFromInventaire(
      this.inventaireForm,
      previousDonnee.inventaire
    );
  }
  public onNextDonneeBtnClicked = (): void => {
    this.navigationService
      .getNextDonnee()
      .then((donnee: DonneeWithNavigationData) => {
        this.displayNextDonnee(donnee);

        this.navigationService.updateNavigationAfterNextDonneeIsDisplayed(
          donnee.previousDonneeId,
          donnee.nextDonneeId
        );
      });
  };

  public onDeleteDonneeBtnClicked = (): void => {
    const deleteDialogData = new ConfirmationDialogData(
      "Confirmation de suppression",
      "Êtes-vous certain de vouloir supprimer cette fiche espèce ?",
      "Oui, supprimer",
      "Non, annuler"
    );
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "450px",
      data: deleteDialogData
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onDeleteConfirmButtonClicked();
      }
    });
  };

  public onDeleteConfirmButtonClicked = (): void => {
    this.deleteDonnee(
      this.donneeService.getDisplayedDonneeId(),
      this.inventaireService.getDisplayedInventaireId()
    );
  };

  public deleteDonnee = (donneeId: number, inventaireId: number): void => {
    this.backendApiService
      .deleteDonnee(donneeId, inventaireId)
      .subscribe((response: PostResponse) => {
        if (response.isSuccess) {
          this.onDeleteDonneeSuccess();
        } else {
          this.onDeleteDonneeError(response.message);
        }
      });
  };

  private onDeleteDonneeError = (errorMessage: string): void => {
    this.statusMessageService.showErrorMessage(
      "Une erreur est survenue pendant la suppression de la fiche espèce.",
      errorMessage
    );
  };

  private onDeleteDonneeSuccess = (): void => {
    this.statusMessageService.showSuccessMessage(
      "La fiche espèce a été supprimée avec succès."
    );
    this.navigationService
      .getNextDonnee()
      .then((donnee: DonneeWithNavigationData) => {
        this.displayNextDonnee(donnee);
        this.navigationService.updateNavigationAfterADonneeWasDeleted(
          donnee.previousDonneeId,
          donnee.nextDonneeId
        );

        // Check if the current inventaire is still existing
        if (this.inventaireService.getDisplayedInventaireId()) {
          this.backendApiService
            .getInventaireIdById(
              this.inventaireService.getDisplayedInventaireId()
            )
            .subscribe((responseId: number) => {
              if (!responseId) {
                this.inventaireService.setDisplayedInventaireId(null);
              }
            });
        }
      });
  };

  private displayNextDonnee = (nextDonnee: Donnee): void => {
    this.creationModeService.updateCreationMode(
      this.navigationService.getNextMode()
    );
    if (this.creationModeService.isInventaireMode()) {
      this.switchToInventaireMode();
    } else if (this.creationModeService.isDonneeMode()) {
      this.switchToEditionDonneeMode();
    }

    this.inventaireService.setInventaireFormFromInventaire(
      this.inventaireForm,
      nextDonnee.inventaire,
      this.navigationService.getSavedDepartement(),
      this.navigationService.getSavedCommune()
    );
    this.donneeService.setDonneeFormFromDonnee(
      this.donneeForm,
      nextDonnee,
      this.navigationService.getSavedClasse()
    );
  };

  /**
   * When clicking on New Inventaire button
   * we switch to inventaire mode and reset the current inventaire ID to null
   * but we do not reset the form fields
   */
  public onNewInventaireBtnClicked = (): void => {
    this.inventaireService.setDisplayedInventaireId(null);
    this.switchToInventaireMode();
  };

  public onEditInventaireBtnClicked = (): void => {
    this.switchToInventaireMode();
  };

  public onNewDonneeBtnClicked = (): void => {
    this.switchToNewInventaireMode();
  };

  public onSearchByIdBtnClicked = (): void => {
    const dialogRef = this.dialog.open(SearchByIdDialogComponent, {
      width: "450px"
    });

    dialogRef.afterClosed().subscribe((idToFind: number) => {
      if (idToFind) {
        // Save the current donnee, inventaire and mode
        if (!this.creationModeService.isUpdateMode()) {
          this.saveCurrentContext(this.getCurrentDonneeFromForm());
        }
        this.displayDonneeById(idToFind);
      }
    });
  };

  private switchToInventaireMode = (): void => {
    this.creationModeService.updateCreationMode(
      CreationModeEnum.NEW_INVENTAIRE
    );
    InventaireHelper.updateFormState(this.inventaireForm, true);
    DonneeHelper.updateFormState(this.donneeForm, false);
    if (document.getElementById("input-Observateur")) {
      document.getElementById("input-Observateur").focus();
    }
  };

  private switchToEditionDonneeMode = (): void => {
    this.creationModeService.updateCreationMode(CreationModeEnum.NEW_DONNEE);
    InventaireHelper.updateFormState(this.inventaireForm, false);
    DonneeHelper.updateFormState(this.donneeForm, true);
    document.getElementById("input-Espèce").focus();
  };

  private switchToUpdateMode = (): void => {
    this.creationModeService.updateCreationMode(CreationModeEnum.UPDATE);
    InventaireHelper.updateFormState(this.inventaireForm, true);
    DonneeHelper.updateFormState(this.donneeForm, true);
    document.getElementById("input-Observateur").focus();
  };

  public getDisplayedDonneeId$ = (): Observable<number> => {
    return this.donneeService.getDisplayedDonneeId$();
  };
  public getCurrentDonneeIndex$ = (): Observable<number> => {
    return this.navigationService.getCurrentDonneeIndex$();
  };

  public getCoordinatesSystem$ = (): Observable<CoordinatesSystem> => {
    return this.coordinatesSystem$.pipe(
      map((system) => COORDINATES_SYSTEMS_CONFIG[system])
    );
  };
}
