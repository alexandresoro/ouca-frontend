import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Classe } from "ouca-common/classe.object";
import { Commune } from "ouca-common/commune.object";
import {
  CoordinatesSystem,
  CoordinatesSystemType,
  COORDINATES_SYSTEMS_CONFIG,
} from "ouca-common/coordinates-system";
import { CreationPage } from "ouca-common/creation-page.object";
import { Departement } from "ouca-common/departement.object";
import { Espece } from "ouca-common/espece.object";
import { Lieudit } from "ouca-common/lieudit.object";
import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs";
import { distinctUntilChanged, filter, map, takeUntil } from "rxjs/operators";
import { CreationModeService } from "src/app/services/creation-mode.service";
import { CreationPageModelService } from "src/app/services/creation-page-model.service";
import { DonneeFormService } from "src/app/services/donnee-form.service";
import { InventaireFormService } from "src/app/services/inventaire-form.service";
import { RegroupementService } from "src/app/services/regroupement.service";
import { CreationPageService } from "../../../../services/creation-page.service";
import { DonneeService } from "../../../../services/donnee.service";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { MultipleOptionsDialogComponent } from "../../../shared/components/multiple-options-dialog/multiple-options-dialog.component";
import { SearchByIdDialogComponent } from "../../components/search-by-id-dialog/search-by-id-dialog.component";
import {
  getDeleteDonneeDialogData,
  getUpdateInventaireDialogData,
} from "../../helpers/creation-dialog.helper";

@Component({
  styleUrls: ["./creation.component.scss"],
  templateUrl: "./creation.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreationComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();

  public pageModel$: Observable<CreationPage>;

  public nextRegroupement$: Observable<number> = new Observable<number>();

  public departements$: Observable<Departement[]>;

  public communes$: Observable<Commune[]>;

  public lieuxdits$: Observable<Lieudit[]>;

  public classes$: Observable<Classe[]>;

  public especes$: Observable<Espece[]>;

  public inventaireForm: FormGroup;

  public donneeForm: FormGroup;

  private coordinatesSystem$: Observable<CoordinatesSystemType>;

  private isModalOpened$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  constructor(
    private creationModeService: CreationModeService,
    private creationPageService: CreationPageService,
    private creationPageModelService: CreationPageModelService,
    private dialog: MatDialog,
    private donneeFormService: DonneeFormService,
    private donneeService: DonneeService,
    private inventaireFormService: InventaireFormService,
    private regroupementService: RegroupementService
  ) {}

  public ngOnInit(): void {
    // Create the inventaire form group
    this.inventaireForm = this.inventaireFormService.getForm();
    this.donneeForm = this.donneeFormService.getForm();

    // Map all observables of the page
    this.pageModel$ = this.creationPageModelService.getCreationPage$().pipe(
      filter((creationPage) => !!creationPage),
      takeUntil(this.destroy$)
    );

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

    this.nextRegroupement$ = this.regroupementService.getNextRegroupement$();

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

    this.creationPageService.initializeCreationPage();
  }

  public ngOnDestroy(): void {
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
    this.creationPageService.updateInventaire();
  };

  /**
   * Called when clicking on "Enregistrer la fiche espèce" button
   */
  private onSaveDonneeButtonClicked = (): void => {
    this.creationPageService.createDonnee();
  };

  /**
   * Called when clicking on "Mettre à jour les fiches inventaire et espèce"
   */
  private onSaveInventaireAndDonneeButtonClicked = (): void => {
    this.creationPageService
      .isInventaireUpdated()
      .subscribe((isInventaireUpdated) => {
        isInventaireUpdated
          ? this.openInventaireDialog()
          : this.creationPageService.updateInventaireAndDonnee(false);
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
      ),
    });

    dialogRef.afterClosed().subscribe((option) => {
      if (
        option === ALL_DONNEES_OPTION ||
        option === ONLY_CURRENT_DONNEE_OPTION
      ) {
        const shouldCreateNewInventaire = option === ONLY_CURRENT_DONNEE_OPTION;
        this.creationPageService.updateInventaireAndDonnee(
          shouldCreateNewInventaire
        );
      }
    });
  };

  /**
   * Called when clicking on "Donnee précédente" button
   */
  public onPreviousDonneeBtnClicked = (): void => {
    this.creationPageService.displayPreviousDonnee();
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
      data: getDeleteDonneeDialogData(),
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
    this.creationPageService.createNewInventaire();
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
      width: "450px",
    });

    dialogRef.afterClosed().subscribe((donneeId: number) => {
      if (donneeId) {
        this.creationPageService.displayDonneeById(donneeId);
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
      this.onSaveButtonClicked();
    }
  }
}
