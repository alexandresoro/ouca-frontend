import { Injectable } from "@angular/core";
import { Donnee } from "ouca-common/donnee.object";
import { Inventaire } from "ouca-common/inventaire.object";
import { PostResponse } from "ouca-common/post-response.object";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import { InventaireHelper } from "../modules/donnee-creation/helpers/inventaire.helper";
import { DonneeInCache } from "../modules/donnee-creation/models/donnee-in-cache.model";
import { BackendApiService } from "./backend-api.service";
import { CreationCacheService } from "./creation-cache.service";
import { CreationModeService } from "./creation-mode.service";
import { CreationPageModelService } from "./creation-page-model.service";
import { DonneeFormService } from "./donnee-form.service";
import { DonneeService } from "./donnee.service";
import { InventaireFormService } from "./inventaire-form.service";
import { RegroupementService } from "./regroupement.service";
import { StatusMessageService } from "./status-message.service";

@Injectable({
  providedIn: "root",
})
export class CreationPageService {
  private requestedDonneeId$: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(null);

  constructor(
    private backendApiService: BackendApiService,
    private creationPageModelService: CreationPageModelService,
    private creationCacheService: CreationCacheService,
    private creationModeService: CreationModeService,
    private donneeFormService: DonneeFormService,
    private donneeService: DonneeService,
    private inventaireFormService: InventaireFormService,
    private regroupementService: RegroupementService,
    private statusMessageService: StatusMessageService
  ) {}

  public setRequestedDonneeId = (id: number): void => {
    this.requestedDonneeId$.next(id);
  };

  public initializeCreationPage = (): void => {
    this.regroupementService.updateNextRegroupement();
    this.donneeService.initialize();
    this.creationPageModelService.refreshPageModel();

    this.creationPageModelService.getCreationPage$().subscribe(() => {
      const requestedDonneeId = this.requestedDonneeId$.value;
      this.requestedDonneeId$.next(null);

      // If the user navigated to this page with a defined id, retrieve this id
      if (requestedDonneeId != null) {
        this.donneeService
          .getDonneeById(requestedDonneeId)
          .subscribe((isSuccessful) => {
            if (isSuccessful) {
              this.creationModeService.setStatus(true, true);
            }
          });
      } else {
        // Otherwise call, the normal initialization of the page
        this.creationModeService.setStatus(true, false);
      }
    });
  };

  public createDonnee = (): void => {
    const inventaire: Inventaire = this.inventaireFormService.getInventaireFromForm();

    this.saveInventaire(inventaire).subscribe((savedInventaireId) => {
      this.inventaireFormService.setInventaireIdInForm(savedInventaireId);

      const donnee: Donnee = this.donneeFormService.getDonneeFromForm();
      donnee.inventaireId = savedInventaireId;

      this.saveDonnee(donnee).subscribe(() => {
        this.donneeFormService.resetForm();
        document.getElementById("input-Espèce")?.focus();
      });
    });
  };

  public updateInventaire(): void {
    const inventaire: Inventaire = this.inventaireFormService.getInventaireFromForm();
    if (inventaire.id) {
      // Update the existing inventaire and switch to donnee mode
      this.saveInventaire(inventaire).subscribe((savedInventaireId) => {
        this.inventaireFormService.setInventaireIdInForm(savedInventaireId);

        this.creationModeService.setStatus(false, true);
      });
    } else {
      // Wait until first donnee is created to create the inventaire
      // Switch to donnee mode
      this.creationModeService.setStatus(false, true);
    }
  }

  public updateInventaireAndDonnee = (
    shouldCreateNewInventaire?: boolean
  ): void => {
    const inventaire: Inventaire = this.inventaireFormService.getInventaireFromForm();

    if (shouldCreateNewInventaire) {
      inventaire.id = null;
    }

    this.saveInventaire(inventaire, true).subscribe((savedInventaireId) => {
      this.inventaireFormService.setInventaireIdInForm(savedInventaireId);

      const donnee: Donnee = this.donneeFormService.getDonneeFromForm();
      donnee.inventaireId = savedInventaireId;

      this.saveDonnee(donnee, true).subscribe(() => {
        document.getElementById("input-Observateur")?.focus();
      });
    });
  };

  public isInventaireUpdated = (): Observable<boolean> => {
    const newInventaire: Inventaire = this.inventaireFormService.getInventaireFromForm();

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

  public saveDonneeInCache = (): void => {
    if (!this.donneeService.isCurrentDonneeAnExistingOne()) {
      const inventaire = this.inventaireFormService.getInventaireFormObject();
      const donnee = this.donneeFormService.getDonneeFormObject(inventaire);
      const isInventaireEnabled = this.inventaireFormService.isFormEnabled();
      const isDonneeEnabled = this.donneeFormService.isFormEnabled();
      this.creationCacheService.saveCurrentContext(
        donnee,
        isInventaireEnabled,
        isDonneeEnabled
      );
    }
  };

  public displayDonneeById = (id: number): void => {
    this.saveDonneeInCache();

    this.donneeService.getDonneeById(id).subscribe((isSuccessful) => {
      if (isSuccessful) {
        this.creationModeService.setStatus(true, true);
      }
    });
  };

  public displayPreviousDonnee = (): void => {
    this.saveDonneeInCache();

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
  public createNewInventaire = (): void => {
    this.inventaireFormService.setInventaireIdInForm(null);
    this.creationModeService.setStatus(true, false);
  };

  public editCurrentInventaire = (): void => {
    this.creationModeService.setStatus(true, false);
  };
}
