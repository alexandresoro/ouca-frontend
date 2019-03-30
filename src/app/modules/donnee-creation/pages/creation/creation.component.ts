import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { Classe } from "basenaturaliste-model/classe.object";
import { Commune } from "basenaturaliste-model/commune.object";
import { CreationPage } from "basenaturaliste-model/creation-page.object";
import { DbUpdateResult } from "basenaturaliste-model/db-update-result.object";
import { Departement } from "basenaturaliste-model/departement.object";
import { Donnee } from "basenaturaliste-model/donnee.object";
import { Espece } from "basenaturaliste-model/espece.object";
import { Inventaire } from "basenaturaliste-model/inventaire.object";
import { Lieudit } from "basenaturaliste-model/lieudit.object";
import { Subject } from "rxjs";
import { ConfirmationDialogData } from "../../../shared/components/confirmation-dialog/confirmation-dialog-data.object";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { PageComponent } from "../../../shared/components/page.component";
import {
  PageStatus,
  PageStatusHelper
} from "../../../shared/helpers/page-status.helper";
import { BackendApiService } from "../../../shared/services/backend-api.service";
import { SearchByIdDialogComponent } from "../../components/search-by-id-dialog/search-by-id-dialog.component";
import { CreationModeEnum } from "../../helpers/creation-mode.enum";
import { CreationModeHelper } from "../../helpers/creation-mode.helper";
import { DonneeHelper } from "../../helpers/donnee.helper";
import { InventaireHelper } from "../../helpers/inventaire.helper";
import { NavigationService } from "../../services/navigation.service";

@Component({
  templateUrl: "./creation.tpl.html"
})
export class CreationComponent extends PageComponent implements OnInit {
  public pageModel: CreationPage = {} as CreationPage;

  public pageStatusEnum = PageStatus;

  public nextRegroupement: number;

  public departements$: Subject<Departement[]>;

  public communes$: Subject<Commune[]>;

  public lieuxdits$: Subject<Lieudit[]>;

  public classes$: Subject<Classe[]>;

  public especes$: Subject<Espece[]>;

  public inventaireForm: FormGroup;

  public donneeForm: FormGroup;

  constructor(
    private backendApiService: BackendApiService,
    public dialog: MatDialog,
    public navigationService: NavigationService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.inventaireForm = InventaireHelper.createInventaireForm();
    this.donneeForm = DonneeHelper.createDonneeForm();

    this.departements$ = new Subject();
    this.communes$ = new Subject();
    this.lieuxdits$ = new Subject();
    this.classes$ = new Subject();
    this.especes$ = new Subject();

    this.initCreationPage();
  }

  /**
   * Called when launching the page
   * Call the back-end to get the initial creation page model
   */
  private initCreationPage(): void {
    this.backendApiService.getCreationInitialPageModel().subscribe(
      (creationPage: CreationPage) => {
        this.onInitCreationPageSucces(creationPage);
      },
      (error: any) => {
        this.onInitCreationPageError(error);
      }
    );
  }

  private onInitCreationPageError(error: any): void {
    PageStatusHelper.setErrorStatus(
      "Impossible de charger la page de création.",
      error
    );
  }

  /**
   * If back-end call is successful, use the initial creation page model to build the page
   * @param creationPage: CreationPage
   */
  private onInitCreationPageSucces(creationPage: CreationPage): void {
    if (!!creationPage && !!creationPage.observateurs) {
      this.pageModel = creationPage;

      console.log("Modèle de la page de création", this.pageModel);

      this.communes$.next(this.pageModel ? this.pageModel.communes : []);
      this.departements$.next(
        this.pageModel ? this.pageModel.departements : []
      );
      this.lieuxdits$.next(this.pageModel ? this.pageModel.lieudits : []);
      this.classes$.next(this.pageModel ? this.pageModel.classes : []);
      this.especes$.next(this.pageModel ? this.pageModel.especes : []);

      this.nextRegroupement = this.pageModel.nextRegroupement;

      this.navigationService.init(
        this.pageModel.lastDonnee,
        this.pageModel.numberOfDonnees
      );

      // Page model is ready, initalize the page to create a first inventaire
      this.switchToNewInventaireMode();
    } else {
      this.onInitCreationPageError(creationPage);
    }
  }

  /**
   * Initialize the page to be ready to create an inventaire
   */
  private switchToNewInventaireMode(): void {
    this.navigationService.resetPreviousAndNextDonnee();
    InventaireHelper.initializeInventaireForm(
      this.inventaireForm,
      this.pageModel
    );
    DonneeHelper.initializeDonneeForm(this.donneeForm, this.pageModel);

    this.switchToInventaireMode();
  }

  public isNewInventaireBtnDisplayed(): boolean {
    return CreationModeHelper.isDonneeMode();
  }

  public isUpdateInventaireBtnDisplayed(): boolean {
    return CreationModeHelper.isDonneeMode();
  }

  public isSaveInventaireBtnDisplayed(): boolean {
    return CreationModeHelper.isInventaireMode();
  }

  public isUpdateDonneeBtnDisplayed(): boolean {
    return CreationModeHelper.isUpdateMode();
  }
  public isSaveDonneeBtnDisplayed(): boolean {
    return CreationModeHelper.isDonneeMode();
  }

  public isNewDonneeBtnDisplayed(): boolean {
    return CreationModeHelper.isUpdateMode();
  }

  public isDeleteDonneeBtnDisplayed(): boolean {
    return CreationModeHelper.isUpdateMode();
  }

  public isPreviousDonneeBtnDisplayed(): boolean {
    return this.navigationService.hasPreviousDonnee();
  }

  public isNextDonneeBtnDisplayed(): boolean {
    return this.navigationService.hasNextDonnee();
  }

  /**
   * Called when clicking on Save Inventaire button
   */
  public saveInventaire(): void {
    const inventaireToBeSaved: Inventaire = InventaireHelper.getInventaireFromInventaireForm(
      this.inventaireForm
    );

    this.backendApiService.saveInventaire(inventaireToBeSaved).subscribe(
      (saveInventaireResult: DbUpdateResult) => {
        this.onCreateInventaireSuccess(saveInventaireResult);
      },
      (error: any) => {
        this.onCreateInventaireError(error);
      }
    );
  }

  private onCreateInventaireError(error: any): void {
    PageStatusHelper.setErrorStatus(
      "Echec de la création de la fiche inventaire.",
      error
    );
  }

  private onCreateInventaireSuccess(
    saveInventaireResult: DbUpdateResult
  ): void {
    if (
      !!saveInventaireResult &&
      (!!saveInventaireResult.insertId || !!saveInventaireResult.affectedRows)
    ) {
      if (!!saveInventaireResult.insertId) {
        PageStatusHelper.setSuccessStatus(
          "La fiche inventaire a été créée avec succès."
        );
        InventaireHelper.setDisplayedInventaireId(
          saveInventaireResult.insertId
        );
      } else {
        PageStatusHelper.setSuccessStatus(
          "La fiche inventaire a été mise-à-jour avec succès."
        );
      }
      this.switchToEditionDonneeMode();
    } else {
      this.onCreateInventaireError(saveInventaireResult);
    }
  }

  /**
   * Called when clicking on Save Donnee button
   */
  public saveDonnee(): void {
    const donneeToBeSaved: Donnee = DonneeHelper.getDonneeFromDonneeForm(
      this.donneeForm
    );

    this.backendApiService.saveDonnee(donneeToBeSaved).subscribe(
      (saveResult: Donnee) => {
        this.onSaveDonneeSuccess(saveResult);
      },
      (saveError: any) => {
        this.onSaveDonneeError(saveError);
      }
    );
  }

  private onSaveDonneeError(saveError: any) {
    PageStatusHelper.setErrorStatus(
      "Echec de la création de la fiche espèce.",
      saveError
    );
  }

  private onSaveDonneeSuccess(savedDonnee: Donnee) {
    if (!!savedDonnee && !!savedDonnee.id) {
      PageStatusHelper.setSuccessStatus(
        "La fiche espèce a été créée avec succès."
      );
      this.navigationService.updateNavigationAfterADonneeWasSaved(savedDonnee);

      this.updateNextRegroupement();

      DonneeHelper.initializeDonneeForm(this.donneeForm, this.pageModel);
    } else {
      this.onSaveDonneeError(savedDonnee);
    }
  }

  /**
   * Called when a donnee is saved to get the next regroupement number
   */
  private updateNextRegroupement(): void {
    this.backendApiService.getNextRegroupement().subscribe(
      (regroupement: number) => {
        this.nextRegroupement = regroupement;
      },
      (error: any) => {
        PageStatusHelper.setErrorStatus(
          "La fiche espèce a été créée" +
            " mais échec lors de la récupération du prochain numéro de regroupement utilisable.",
          error
        );
      }
    );
  }

  /**
   * Called when clicking on save donnee when in update mode
   */
  public saveInventaireAndDonnee(): void {
    const isInventaireUpdated: boolean = true; // TODO

    if (!!isInventaireUpdated) {
      this.displayInventaireDialog();
    }
  }

  // TODO create a dialog with also a cancel option
  private displayInventaireDialog(): void {
    const updateInventaireDialogData = new ConfirmationDialogData(
      "Confirmation de mise-à-jour",
      "Voulez-vous mettre à jour la fiche inventaire pour cette fiche espèce " +
        "seulement ou pour toutes les fiches espèces avec cette fiche inventaire ?",
      "Pour toutes les fiches espèces de cette fiche inventaire",
      "Pour cette fiche espèce seulement"
    );
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "700px",
      data: updateInventaireDialogData
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!!result) {
        // We just update the existing inventaire
        this.updateInventaireAndDonnee(false);
      } else {
        // We create a new inventaire for this donnee
        this.updateInventaireAndDonnee(true);
      }
    });
  }

  /**
   * Call the backend to update the fiche inventaire and fiche espece
   * If the user wants to update the fiche inventaire only for this fiche espece then we create a new inventaire
   * @param createNewInventaire If we should create a new inventaire for the donnee or just update it
   */
  private updateInventaireAndDonnee(createNewInventaire: boolean): void {
    const inventaireToSave: Inventaire = InventaireHelper.getInventaireFromInventaireForm(
      this.inventaireForm
    );
    if (!!createNewInventaire) {
      inventaireToSave.id = null;
    }

    const donneeToSave: Donnee = DonneeHelper.getDonneeFromDonneeForm(
      this.donneeForm
    );
    donneeToSave.inventaireId = inventaireToSave.id;

    this.backendApiService.saveInventaire(inventaireToSave).subscribe(
      (saveInventaireResult: DbUpdateResult) => {
        if (
          !!saveInventaireResult &&
          (saveInventaireResult.affectedRows > 0 ||
            saveInventaireResult.insertId > 0)
        ) {
          if (!!createNewInventaire) {
            donneeToSave.inventaireId = saveInventaireResult.insertId;
          }

          this.backendApiService.saveDonnee(donneeToSave).subscribe(
            (saveDonneeResult: Donnee) => {
              this.onUpdateDonneeAndInventaireSuccess(saveDonneeResult);
            },
            (saveDonneeError: any) => {
              this.onUpdateDonneeError(saveDonneeError);
            }
          );
        } else {
          this.onUpdateInventaireError(saveInventaireResult);
        }
      },
      (saveInventaireError: any) => {
        this.onUpdateInventaireError(saveInventaireError);
      }
    );
  }

  private onUpdateInventaireError(error: any): void {
    PageStatusHelper.setErrorStatus(
      "Impossible de mettre à jour la fiche inventaire et la fiche espèce.",
      error
    );
  }

  private onUpdateDonneeError(error: any): void {
    PageStatusHelper.setErrorStatus(
      "Impossible de mettre à jour la fiche inventaire et la fiche espèce.",
      error
    );
  }

  private onUpdateDonneeAndInventaireSuccess(savedDonnee: Donnee): void {
    if (!!savedDonnee && !!savedDonnee.id) {
      PageStatusHelper.setSuccessStatus(
        "La fiche espèce et sa fiche inventaire ont été mises-à-jour avec succès."
      );
      InventaireHelper.setDisplayedInventaireId(savedDonnee.inventaireId);
    } else {
      this.onUpdateDonneeError(savedDonnee);
    }
  }

  /**
   * Called when clicking on "Donnee precedente" button
   */
  public onPreviousDonneeBtnClicked(): void {
    const currentDonnee: Donnee = this.getCurrentDonneeFromForm();

    // Save the current donnee, inventaire and mode
    if (!CreationModeHelper.isUpdateMode()) {
      this.saveCurrentContext(currentDonnee);
      this.switchToUpdateMode();
    }

    this.displayPreviousDonnne();

    this.navigationService.updateNavigationAfterPreviousDonneeIsDisplayed(
      currentDonnee
    );
  }

  private getCurrentDonneeFromForm(): Donnee {
    const currentDonnee: Donnee = DonneeHelper.getDonneeFromDonneeForm(
      this.donneeForm
    );
    currentDonnee.inventaire = InventaireHelper.getInventaireFromInventaireForm(
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

  private displayPreviousDonnne() {
    DonneeHelper.setDonneeFormFromDonnee(
      this.donneeForm,
      this.navigationService.getPreviousDonnee(),
      this.pageModel
    );
    InventaireHelper.setInventaireFormFromInventaire(
      this.inventaireForm,
      this.navigationService.getPreviousDonnee().inventaire,
      this.pageModel
    );
  }
  public onNextDonneeBtnClicked(): void {
    this.displayNextDonnee();

    this.navigationService.updateNavigationAfterNextDonneeIsDisplayed(
      this.getCurrentDonneeFromForm()
    );
  }

  public onDeleteDonneeBtnClicked(): void {
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
      if (!!result) {
        this.onDeleteConfirmButtonClicked();
      }
    });
  }

  public onDeleteConfirmButtonClicked(): void {
    this.deleteDonnee(DonneeHelper.getDisplayedDonneeId());
  }

  public deleteDonnee(donneeId: number): void {
    this.backendApiService.deleteDonnee(donneeId).subscribe(
      (deleteResult: DbUpdateResult) => {
        this.onDeleteDonneeSuccess(deleteResult);
      },
      (deleteError: any) => {
        this.onDeleteDonneeError(deleteError);
      }
    );
  }

  private onDeleteDonneeError(error: any): void {
    PageStatusHelper.setErrorStatus(
      "Echec de la suppression de la fiche espèce.",
      error
    );
  }

  private onDeleteDonneeSuccess(deleteResult: any): void {
    if (!!deleteResult && !!deleteResult.affectedRows) {
      PageStatusHelper.setSuccessStatus(
        "La fiche espèce a été supprimée avec succès."
      );

      this.displayNextDonnee();
      this.navigationService.updateNavigationAfterADonneeWasDeleted();
    } else {
      this.onDeleteDonneeError(deleteResult);
    }
  }

  private displayNextDonnee(): void {
    CreationModeHelper.updateCreationMode(this.navigationService.getNextMode());
    if (CreationModeHelper.isInventaireMode()) {
      this.switchToInventaireMode();
    } else if (CreationModeHelper.isDonneeMode()) {
      this.switchToEditionDonneeMode();
    }

    InventaireHelper.setInventaireFormFromInventaire(
      this.inventaireForm,
      this.navigationService.getNextDonnee().inventaire,
      this.pageModel,
      this.navigationService.getSavedDepartement(),
      this.navigationService.getSavedCommune()
    );
    DonneeHelper.setDonneeFormFromDonnee(
      this.donneeForm,
      this.navigationService.getNextDonnee(),
      this.pageModel,
      this.navigationService.getSavedClasse()
    );
  }

  public onNewInventaireBtnClicked(): void {
    this.switchToNewInventaireMode();
  }

  public onEditInventaireBtnClicked(): void {
    this.switchToInventaireMode();
  }

  public onNewDonneeBtnClicked(): void {
    this.switchToNewInventaireMode();
  }

  public onSearchByIdBtnClicked(): void {
    const dialogRef = this.dialog.open(SearchByIdDialogComponent, {
      width: "450px"
    });

    dialogRef.afterClosed().subscribe((idToFind: number) => {
      if (!!idToFind) {
        // Save the current donnee, inventaire and mode
        if (!CreationModeHelper.isUpdateMode()) {
          this.saveCurrentContext(this.getCurrentDonneeFromForm());
        }

        this.backendApiService.getDonneeByIdWithContext(idToFind).subscribe(
          (result: any) => {
            if (!!result && !!result.donnee) {
              InventaireHelper.setInventaireFormFromInventaire(
                this.inventaireForm,
                (result.donnee as Donnee).inventaire as Inventaire,
                this.pageModel
              );
              DonneeHelper.setDonneeFormFromDonnee(
                this.donneeForm,
                result.donnee as Donnee,
                this.pageModel
              );
              this.switchToUpdateMode();
              this.navigationService.updateNavigationAfterSearchDonneeById(
                +result.indexDonnee,
                result.previousDonnee,
                result.nextDonnee
              );
            } else {
              PageStatusHelper.setErrorStatus(
                "Aucune fiche espèce trouvée avec l'ID " + idToFind + "."
              );
            }
          },
          (error: any) => {
            PageStatusHelper.setErrorStatus(
              "Echec de la récupération de la fiche espèce avec l'ID " +
                idToFind +
                ".",
              error
            );
          }
        );
      }
    });
  }

  private switchToInventaireMode(): void {
    CreationModeHelper.updateCreationMode(CreationModeEnum.NEW_INVENTAIRE);
    this.handleInventaireFormState(true);
    this.handleDonneeFormState(false);
    document.getElementById("input-Observateur").focus();
  }

  private switchToEditionDonneeMode(): void {
    CreationModeHelper.updateCreationMode(CreationModeEnum.NEW_DONNEE);
    this.handleInventaireFormState(false);
    this.handleDonneeFormState(true);
    document.getElementById("input-Espèce").focus();
  }

  private switchToUpdateMode(): void {
    CreationModeHelper.updateCreationMode(CreationModeEnum.UPDATE);
    this.handleInventaireFormState(true);
    this.handleDonneeFormState(true);
    document.getElementById("input-Observateur").focus();
  }

  private handleInventaireFormState(toEnable: boolean): void {
    if (toEnable) {
      this.inventaireForm.enable();
    } else {
      this.inventaireForm.disable();
    }
  }

  private handleDonneeFormState(toEnable: boolean): void {
    if (toEnable) {
      this.donneeForm.enable();
    } else {
      this.donneeForm.disable();
    }
  }

  public getDisplayedInventaireId(): number {
    return InventaireHelper.getDisplayedInventaireId();
  }

  public getDisplayedDonneeId(): number {
    return DonneeHelper.getDisplayedDonneeId();
  }

  public getPageStatus(): PageStatus {
    return PageStatusHelper.getStatus();
  }

  public getMessage(): string {
    return PageStatusHelper.getMessage();
  }
}
