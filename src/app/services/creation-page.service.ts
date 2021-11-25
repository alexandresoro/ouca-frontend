import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Apollo, gql } from "apollo-angular";
import { Observable, Subject } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import { InputDonnee, InputInventaire, Inventaire as InventaireQR, MutationUpsertDonneeArgs, MutationUpsertInventaireArgs, QueryInventaireArgs, UpsertDonneeResult, UpsertInventaireResult } from "../model/graphql";
import { Donnee } from '../model/types/donnee.object';
import { InventaireHelper } from "../modules/donnee-creation/helpers/inventaire.helper";
import { DonneeFormValue } from "../modules/donnee-creation/models/donnee-form-value.model";
import { DonneeInCache } from "../modules/donnee-creation/models/donnee-in-cache.model";
import { InventaireFormValue } from "../modules/donnee-creation/models/inventaire-form-value.model";
import { CreationCacheService } from "./creation-cache.service";
import { CreationModeService } from "./creation-mode.service";
import { DonneeFormService } from "./donnee-form.service";
import { DonneeService } from "./donnee.service";
import { InventaireFormService } from "./inventaire-form.service";
import { StatusMessageService } from "./status-message.service";

type InventaireQueryResult = {
  inventaire: InventaireQR
}

const INVENTAIRE_QUERY = gql`
  query InventaireQuery($id: Int!) {
    inventaire(id: $id) {
      id
      observateur {
        id
        libelle
      }
      associes {
        id
        libelle
      }
      date
      heure
      duree
      lieuDit {
        id
        nom
        altitude
        longitude
        latitude
        coordinatesSystem
        commune {
          id
          code
          nom
          departement {
            id
            code
          }
        }
      }
      customizedCoordinates {
        altitude
        longitude
        latitude
        system
      }
      temperature
      meteos {
        id
        libelle
      }
    }
  }
`

type UpsertInventaireMutationResult = {
  upsertInventaire: UpsertInventaireResult
}

const INVENTAIRE_UPSERT = gql`
  mutation UpsertInventaire($data: InputInventaire!, $id: Int, $migrateDonneesIfMatchesExistingInventaire: Boolean) {
    upsertInventaire(data: $data, id: $id, migrateDonneesIfMatchesExistingInventaire: $migrateDonneesIfMatchesExistingInventaire) {
      inventaire {
        id
        observateur {
          id
          libelle
        }
        associes {
          id
          libelle
        }
        date
        heure
        duree
        lieuDit {
          id
          nom
          altitude
          longitude
          latitude
          coordinatesSystem
          commune {
            id
            code
            nom
            departement {
              id
              code
            }
          }
        }
        customizedCoordinates {
          altitude
          longitude
          latitude
          system
        }
        temperature
        meteos {
          id
          libelle
        }
      }
      failureReason {
        inventaireExpectedToBeUpdated
        correspondingInventaireFound
      }
    }
  }
`;

type UpsertDonneeMutationResult = {
  upsertDonnee: UpsertDonneeResult
}

const DONNEE_UPSERT = gql`
  mutation UpsertDonnee($data: InputDonnee!, $id: Int) {
    upsertDonnee(data: $data, id: $id) {
      donnee {
        id
        inventaire {
          id
          observateur {
            id
            libelle
          }
          associes {
            id
            libelle
          }
          date
          heure
          duree
          lieuDit {
            id
            nom
            altitude
            longitude
            latitude
            coordinatesSystem
            commune {
              id
              code
              nom
              departement {
                id
                code
              }
            }
          }
          customizedCoordinates {
            altitude
            longitude
            latitude
            system
          }
          temperature
          meteos {
            id
            libelle
          }
        }
        espece {
          id
          code
          nomFrancais
          nomLatin
          classe {
            id
            libelle
          }
        }
        sexe {
          id
          libelle
        }
        age {
          id
          libelle
        }
        estimationNombre {
          id
          libelle
          nonCompte
        }
        nombre
        estimationDistance {
          id
          libelle
        }
        distance
        regroupement
        comportements {
          id
          code
          libelle
          nicheur
        }
        milieux {
          id
          code
          libelle
        }
        commentaire
      }
      failureReason
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class CreationPageService {
  constructor(
    private apollo: Apollo,
    private creationCacheService: CreationCacheService,
    private creationModeService: CreationModeService,
    private donneeFormService: DonneeFormService,
    private donneeService: DonneeService,
    private inventaireFormService: InventaireFormService,
    private statusMessageService: StatusMessageService
  ) { }

  public createDonnee = (
    inventaireForm: FormGroup,
    donneeForm: FormGroup,
    clearDonnee$: Subject<Donnee>
  ): void => {
    const inventaire = this.inventaireFormService.buildInputInventaireFromForm(
      inventaireForm.value
    );

    this.saveInventaire(inventaire).subscribe((savedInventaireId) => {
      this.inventaireFormService.setInventaireIdInForm(
        inventaireForm,
        savedInventaireId
      );

      const donnee = this.donneeFormService.buildInputDonneeFromForm(
        donneeForm,
        savedInventaireId
      );

      this.saveDonnee(donnee).subscribe(() => {
        clearDonnee$.next(null);
        document.getElementById("input-Espèce")?.focus();
      });
    });
  };

  public updateInventaire(inventaireForm: FormGroup): void {
    const inventaire = this.inventaireFormService.buildInputInventaireFromForm(
      inventaireForm.value
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

  public updateDonnee = (
    inventaireId: number,
    donneeForm: FormGroup,
  ): void => {

    const donnee = this.donneeFormService.buildInputDonneeFromForm(
      donneeForm,
      inventaireId
    );

    this.saveDonnee(donnee, true).subscribe(() => {
      document.getElementById("input-Observateur")?.focus();
    });
  };

  public updateInventaireAndDonnee = (
    inventaireForm: FormGroup,
    donneeForm: FormGroup,
    shouldCreateNewInventaire?: boolean
  ): void => {
    const inventaire = this.inventaireFormService.buildInputInventaireFromForm(
      inventaireForm.value
    );

    if (shouldCreateNewInventaire) {
      inventaire.id = null;
    }

    this.saveInventaire(inventaire, true).subscribe((savedInventaireId) => {
      this.inventaireFormService.setInventaireIdInForm(
        inventaireForm,
        savedInventaireId
      );

      this.updateDonnee(savedInventaireId, donneeForm);
    });
  };

  public isInventaireUpdated = (
    inventaireForm: FormGroup
  ): Observable<boolean> => {
    const newInventaire = this.inventaireFormService.buildInputInventaireFromForm(
      inventaireForm.getRawValue()
    );

    return this.apollo.query<InventaireQueryResult, QueryInventaireArgs>({
      query: INVENTAIRE_QUERY,
      variables: {
        id: newInventaire.id
      },
      fetchPolicy: "no-cache"
    }).pipe(
      map(({ data }) => {
        return InventaireHelper.isInventaireUpdated(
          data?.inventaire,
          newInventaire
        );
      })
    )
  };

  private saveInventaire = (
    inventaire: InputInventaire & { id?: number },
    isUpdateMode?: boolean
  ): Observable<number> => {

    const { id, ...inputInventaire } = inventaire;

    return this.apollo.mutate<UpsertInventaireMutationResult, MutationUpsertInventaireArgs>({
      mutation: INVENTAIRE_UPSERT,
      variables: {
        id,
        data: inputInventaire,
        migrateDonneesIfMatchesExistingInventaire: false // TODO activate this someday
      }
    }).pipe(
      tap(({ data }) => {
        if (data?.upsertInventaire?.inventaire) {
          !isUpdateMode ??
            this.statusMessageService.showSuccessMessage(
              "La fiche inventaire a été sauvegardée avec succès."
            );
        } else {
          this.statusMessageService.showErrorMessage(
            `Une erreur est survenue pendant la sauvegarde de la fiche inventaire.${data?.upsertInventaire?.failureReason ? (" " + JSON.stringify(data.upsertInventaire.failureReason)) : ""}`);
        }
      }),
      filter(({ data }) => {
        return !!data?.upsertInventaire?.inventaire;
      }),
      map(({ data }) => {
        return data.upsertInventaire.inventaire.id;
      })
    )
  };

  private saveDonnee = (
    donnee: InputDonnee & { id?: number },
    isUpdateMode?: boolean
  ): Observable<number> => {

    const { id, ...inputDonnee } = donnee;

    return this.apollo.mutate<UpsertDonneeMutationResult, MutationUpsertDonneeArgs>({
      mutation: DONNEE_UPSERT,
      variables: {
        id,
        data: inputDonnee
      }
    }).pipe(
      tap(({ data }) => {
        if (data?.upsertDonnee?.donnee) {
          this.statusMessageService.showSuccessMessage(
            isUpdateMode
              ? "La fiche espèce et sa fiche inventaire ont été mises à jour avec succès."
              : "La fiche espèce a été sauvegardée avec succès."
          );

          if (!isUpdateMode) {
            this.donneeService.setPreviousDonneeId(data.upsertDonnee.donnee.id);
          }
        } else {
          this.statusMessageService.showErrorMessage(
            `Une erreur est survenue pendant la sauvegarde de la fiche espèce.${data?.upsertDonnee?.failureReason ? (" " + data.upsertDonnee.failureReason) : ""}`
          );
        }
      }),
      filter(({ data }) => {
        return !!data?.upsertDonnee?.donnee;
      }),
      map(({ data }) => {
        return data.upsertDonnee.donnee?.id;
      })
    );
  };

  public deleteCurrentDonnee = (): void => {
    this.donneeService
      .deleteCurrentDonnee()
      .subscribe((success) => {
        if (success) {
          // After the successful deletion of the donnee, we need to retrieve the "next" one
          if (this.donneeService.hasNextDonnee()) {
            this.displayNextDonnee();
          } else {
            this.backToCurrentEdition();
          }
        }
      });
  };

  public resetCurrentEdition = (): void => {
    this.donneeService.setCurrentlyEditingDonnee(null);
    this.creationModeService.setStatus(true, false);
  };

  public backToCurrentEdition = (): void => {
    const donneeInCache: DonneeInCache = this.creationCacheService.getSavedContext();

    if (!donneeInCache) {
      // It could be the case when we want to come back to the current donnee,
      // but never reached before (e.g. coming from a requestedId directly)
      this.donneeService.initialize().subscribe(() => {
        this.creationModeService.setStatus(true, false);
      });
      return;
    }

    this.donneeService.setCurrentlyEditingDonnee(donneeInCache.donnee);
    this.creationModeService.setStatus(
      donneeInCache.isInventaireEnabled,
      donneeInCache.isDonneeEnabled
    );
  };

  public addADonneeToAnExistingInventaire = (
    inventaireForm: FormGroup
  ): void => {
    const donnee = {
      isDonneeEmpty: true,
      inventaire: this.inventaireFormService.buildCachedInventaireFromForm(inventaireForm?.value)
    };
    this.donneeService.setCurrentlyEditingDonnee(donnee);
    this.creationModeService.setStatus(false, true);
  };

  public saveDonneeInCache = (
    inventaireForm: FormGroup,
    donneeForm: FormGroup
  ): void => {
    const inventaire = this.inventaireFormService.buildCachedInventaireFromForm(
      inventaireForm?.value as InventaireFormValue
    );
    const donnee = this.donneeFormService.buildCachedDonneeFromForm(
      donneeForm?.value as DonneeFormValue,
      inventaire
    );
    const isInventaireEnabled = inventaireForm?.enabled;
    const isDonneeEnabled = donneeForm?.enabled;
    this.creationCacheService.saveCurrentContext(
      donnee,
      isInventaireEnabled,
      isDonneeEnabled
    );
  };

  public displayDonneeByIdAndSaveCurrentCache = (
    inventaireForm: FormGroup,
    donneeForm: FormGroup,
    id: number
  ): Observable<boolean> => {
    if (!this.donneeService.isCurrentDonneeAnExistingOne()) {
      this.saveDonneeInCache(inventaireForm, donneeForm);
    }
    return this.displayDonneeById(id);
  };

  private displayDonneeById = (id: number): Observable<boolean> => {
    return this.donneeService.getDonneeById(id).pipe(
      tap((isSuccessful) => {
        if (isSuccessful) {
          this.creationModeService.setStatus(true, true);
        }
      })
    );
  };

  public displayPreviousDonnee = (
    inventaireForm: FormGroup,
    donneeForm: FormGroup
  ): void => {
    if (!this.donneeService.isCurrentDonneeAnExistingOne()) {
      this.saveDonneeInCache(inventaireForm, donneeForm);
    }

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
