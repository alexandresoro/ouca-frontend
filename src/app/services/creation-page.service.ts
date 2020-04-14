import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Donnee } from "ouca-common/donnee.object";
import { Inventaire } from "ouca-common/inventaire.object";
import { PostResponse } from "ouca-common/post-response.object";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import { InventaireHelper } from "../modules/donnee-creation/helpers/inventaire.helper";
import { DonneeFormObject } from "../modules/donnee-creation/models/donnee-form-object.model";
import { DonneeInCache } from "../modules/donnee-creation/models/donnee-in-cache.model";
import { BackendApiService } from "./backend-api.service";
import { CreationCacheService } from "./creation-cache.service";
import { CreationModeService } from "./creation-mode.service";
import { DonneeFormService } from "./donnee-form.service";
import { DonneeService } from "./donnee.service";
import { InventaireFormService } from "./inventaire-form.service";
import { RegroupementService } from "./regroupement.service";
import { StatusMessageService } from "./status-message.service";

@Injectable({
  providedIn: "root"
})
export class CreationPageService {
  private requestedDonneeId$: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(null);

  constructor(
    private backendApiService: BackendApiService,
    private creationCacheService: CreationCacheService,
    private creationModeService: CreationModeService,
    private donneeFormService: DonneeFormService,
    private donneeService: DonneeService,
    private inventaireFormService: InventaireFormService,
    private regroupementService: RegroupementService,
    private statusMessageService: StatusMessageService
  ) {}

  public createDonnee = (
    inventaireForm: FormGroup,
    donneeForm: FormGroup,
    donneeManual$: Subject<Donnee | DonneeFormObject>
  ): void => {
    const inventaire: Inventaire = this.inventaireFormService.getInventaireFromForm(
      inventaireForm
    );

    this.saveInventaire(inventaire).subscribe((savedInventaireId) => {
      this.inventaireFormService.setInventaireIdInForm(
        inventaireForm,
        savedInventaireId
      );

      const donnee: Donnee = this.donneeFormService.getDonneeFromForm(
        donneeForm
      );
      donnee.inventaireId = savedInventaireId;

      this.saveDonnee(donnee).subscribe(() => {
        donneeManual$.next(null);
        document.getElementById("input-Espèce")?.focus();
      });
    });
  };

  public updateInventaire(inventaireForm: FormGroup): void {
    const inventaire: Inventaire = this.inventaireFormService.getInventaireFromForm(
      inventaireForm
    );
    if (inventaire.id) {
      // Update the existing inventaire and switch to donnee mode
      this.saveInventaire(inventaire).subscribe((savedInventaireId) => {
        this.inventaireFormService.setInventaireIdInForm(
          inventaireForm,
          savedInventaireId
        );

        this.creationModeService.setStatus(false, true);
      });
    } else {
      // Wait until first donnee is created to create the inventaire
      // Switch to donnee mode
      this.creationModeService.setStatus(false, true);
    }
  }

  public updateInventaireAndDonnee = (
    inventaireForm: FormGroup,
    donneeForm: FormGroup,
    shouldCreateNewInventaire?: boolean
  ): void => {
    const inventaire: Inventaire = this.inventaireFormService.getInventaireFromForm(
      inventaireForm
    );

    if (shouldCreateNewInventaire) {
      inventaire.id = null;
    }

    this.saveInventaire(inventaire, true).subscribe((savedInventaireId) => {
      this.inventaireFormService.setInventaireIdInForm(
        inventaireForm,
        savedInventaireId
      );

      const donnee: Donnee = this.donneeFormService.getDonneeFromForm(
        donneeForm
      );
      donnee.inventaireId = savedInventaireId;

      this.saveDonnee(donnee, true).subscribe(() => {
        document.getElementById("input-Observateur")?.focus();
      });
    });
  };

  public isInventaireUpdated = (
    inventaireForm: FormGroup
  ): Observable<boolean> => {
    const newInventaire: Inventaire = this.inventaireFormService.getInventaireFromForm(
      inventaireForm
    );

    return this.backendApiService.getInventaireById(newInventaire.id).pipe(
      map((oldInventaire) => {
        return InventaireHelper.isInventaireUpdated(
          oldInventaire,
          newInventaire
        );
      })
    );
  };

  private saveInventaire = (
    inventaire: Inventaire,
    isUpdateMode?: boolean
  ): Observable<number> => {
    return this.backendApiService.saveInventaire(inventaire).pipe(
      tap((response: PostResponse) => {
        if (response.isSuccess) {
          !isUpdateMode ??
            this.statusMessageService.showSuccessMessage(
              "La fiche inventaire a été sauvegardée avec succès."
            );
        } else {
          this.statusMessageService.showErrorMessage(
            "Une erreur est survenue pendant la sauvegarde de la fiche inventaire. " +
              response.message
          );
        }
      }),
      filter((response) => {
        return response?.isSuccess;
      }),
      map((response) => {
        return response.insertId ? response.insertId : inventaire.id;
      })
    );
  };

  private saveDonnee = (
    donnee: Donnee,
    isUpdateMode?: boolean
  ): Observable<number> => {
    return this.backendApiService.saveDonnee(donnee).pipe(
      tap((response) => {
        if (response.isSuccess) {
          this.statusMessageService.showSuccessMessage(
            isUpdateMode
              ? "La fiche espèce et sa fiche inventaire ont été mises à jour avec succès."
              : "La fiche espèce a été sauvegardée avec succès."
          );
          this.donneeService.setPreviousDonneeId(response.insertId);
        } else {
          this.statusMessageService.showErrorMessage(
            "Une erreur est survenue pendant la sauvegarde de la fiche espèce. " +
              response.message
          );
        }
      }),
      filter((response) => {
        return response?.isSuccess;
      }),
      tap(() => {
        this.regroupementService.updateNextRegroupement();
      }),
      map((response) => {
        return response.insertId ? response.insertId : donnee.id;
      })
    );
  };

  public deleteCurrentDonnee = (): void => {
    this.donneeService.deleteCurrentDonnee();
  };

  public resetCurrentEdition = (): void => {
    this.donneeService.setCurrentlyEditingDonnee(null);
    this.creationModeService.setStatus(true, false);
  };

  public backToCurrentEdition = (): void => {
    const donneeInCache: DonneeInCache = this.creationCacheService.getSavedContext();
    this.donneeService.setCurrentlyEditingDonnee(donneeInCache.donnee);
    this.creationModeService.setStatus(
      donneeInCache.isInventaireEnabled,
      donneeInCache.isDonneeEnabled
    );
  };

  public saveDonneeInCache = (
    inventaireForm: FormGroup,
    donneeForm: FormGroup
  ): void => {
    if (!this.donneeService.isCurrentDonneeAnExistingOne()) {
      const inventaire = this.inventaireFormService.getInventaireFormObject(
        inventaireForm
      );
      const donnee = this.donneeFormService.getDonneeFormObject(
        donneeForm,
        inventaire
      );
      const isInventaireEnabled = inventaireForm?.enabled;
      const isDonneeEnabled = donneeForm?.enabled;
      this.creationCacheService.saveCurrentContext(
        donnee,
        isInventaireEnabled,
        isDonneeEnabled
      );
    }
  };

  public displayDonneeByIdAndSaveCurrentCache = (
    inventaireForm: FormGroup,
    donneeForm: FormGroup,
    id: number
  ): void => {
    this.saveDonneeInCache(inventaireForm, donneeForm);
    this.displayDonneeById(id);
  };

  private displayDonneeById = (id: number): Observable<boolean> => {
    const displayDonneeById$ = this.donneeService.getDonneeById(id);

    displayDonneeById$.subscribe((isSuccessful) => {
      if (isSuccessful) {
        this.creationModeService.setStatus(true, true);
      }
    });

    return displayDonneeById$;
  };

  public displayPreviousDonnee = (
    inventaireForm: FormGroup,
    donneeForm: FormGroup
  ): void => {
    this.saveDonneeInCache(inventaireForm, donneeForm);

    this.donneeService.getPreviousDonnee().subscribe((isSuccessful) => {
      if (isSuccessful) {
        this.creationModeService.setStatus(true, true);
      }
    });
  };

  public displayNextDonnee = (): void => {
    this.donneeService.getNextDonnee().subscribe((isSuccessful) => {
      if (isSuccessful) {
        this.creationModeService.setStatus(true, true);
      }
    });
  };
  public createNewInventaire = (inventaireForm: FormGroup): void => {
    this.inventaireFormService.setInventaireIdInForm(inventaireForm, null);
    this.creationModeService.setStatus(true, false);
  };

  public editCurrentInventaire = (): void => {
    this.creationModeService.setStatus(true, false);
  };
}
