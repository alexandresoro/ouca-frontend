import { Injectable } from "@angular/core";
import { EntiteAvecLibelleEtCode } from "../../../../../../basenaturaliste-model/entite-avec-libelle-et-code.object";
import { BackendApiService } from "../../../../shared/services/backend-api.service";
import { ImportService } from "./import.service";

@Injectable()
export class EntiteAvecLibelleEtCodeImportService extends ImportService {
  private CODE_INDEX = 0;
  private LIBELLE_INDEX = 1;

  constructor(public backendApiService: BackendApiService) {
    super(backendApiService);
  }

  protected getNumberOfColumns(): number {
    return 2;
  }

  protected getObject(objectTab: string[]): EntiteAvecLibelleEtCode {
    return {
      id: null,
      code: objectTab[this.CODE_INDEX],
      libelle: objectTab[this.LIBELLE_INDEX]
    };
  }

  protected isObjectValid(objectTab: string[]): boolean {
    return (
      this.isCodeValid(objectTab[this.CODE_INDEX]) &&
      this.isLibelleValid(objectTab[this.LIBELLE_INDEX])
    );
  }

  private isCodeValid(code: string): boolean {
    let isValid: boolean = true;

    if (!!!code) {
      this.errorMessage = "Le code ne peut pas être vide";
      isValid = false;
    } else {
      // Check that no other object with this code exists
    }

    return isValid;
  }

  private isLibelleValid(libelle: string): boolean {
    let isValid: boolean = true;

    if (!!!libelle) {
      this.errorMessage = "Le libellé ne peut pas être vide";
      isValid = false;
    } else {
      // Check that no other object with this libelle exists
    }

    return isValid;
  }
}
