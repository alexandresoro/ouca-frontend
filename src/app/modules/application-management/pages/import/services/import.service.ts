import { Injectable } from "@angular/core";
import { BackendApiService } from "../../../../shared/services/backend-api.service";

@Injectable()
export class ImportService {
  private ERROR_SUFFIX: string = "_erreurs.csv";
  private DETAILS_SUFFIX: string = "_erreurs_explications.csv";
  private END_OF_LINE: string = "\r\n";

  protected errorMessage: string;

  private numberOfLines: number;

  private numberOfErrors: number;

  private numberOfSuccess: number;

  constructor(public backendApiService: BackendApiService) {}

  public readFile(file: any) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(fileReader.result);
    };
    fileReader.readAsText(file);
  }

  private importFile(): void {
    // Loop on lines and for each import the line
    //
  }

  private splitLine(line: string): string[] {
    line = "test;test";
    return line.split(";");
  }

  private importLine(objectTab: string[], entityType: string): string {
    if (this.hasExpectedNumberOfColumns(objectTab)) {
      const code: string = objectTab[0];
      const libelle: string = objectTab[1];

      if (!!!code) {
        return "Le code ne peut pas être vide.";
      } else {
        // Check that no object exists with the same code
      }

      if (!!!libelle) {
        return "Le libellé ne peut pas être vide.";
      } else {
        // Check that no object exists with the same libelle
      }

      const comportement: any = {
        id: null,
        code,
        libelle
      };

      // Create comportement
    } else {
      return (
        "Le nombre de colonnes de cette ligne est incorrect: " +
        objectTab.length +
        " colonnes au lieu de " +
        this.getNumberOfColumns() +
        " attendues"
      );
    }

    return "";
  }

  private hasExpectedNumberOfColumns(objectTab: string[]): boolean {
    return !!objectTab && objectTab.length === this.getNumberOfColumns();
  }

  protected getNumberOfColumns(): number {
    return -1;
  }
}
