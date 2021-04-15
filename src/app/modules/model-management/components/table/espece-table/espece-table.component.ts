import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Observable } from "rxjs";
import { UIEspece } from "src/app/models/espece.model";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { EntiteSimpleTableComponent } from "../entite-simple-table/entite-simple-table.component";

interface EspeceRow {
  id: number;
  classe: string;
  code: string;
  nomFrancais: string;
  nomLatin: string;
  nbDonnees: number;
}

@Component({
  selector: "espece-table",
  styleUrls: ["./espece-table.component.scss"],
  templateUrl: "./espece-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EspeceTableComponent extends EntiteSimpleTableComponent<UIEspece> {
  public displayedColumns: string[] = [
    "classe",
    "code",
    "nomFrancais",
    "nomLatin",
    "nbDonnees"
  ];

  constructor(private entitiesStoreService: EntitiesStoreService) {
    super();
  }

  ngOnInit(): void {
    this.initialize();
  }

  public getEntities$ = (): Observable<UIEspece[]> => {
    return this.entitiesStoreService.getEspeces$();
  };

  protected getDataSource(especes: UIEspece[]): EspeceRow[] {
    const rows: EspeceRow[] = [];
    especes?.forEach((espece: UIEspece) => {
      rows.push(this.buildRowFromEspece(espece));
    });
    return rows;
  }

  private buildRowFromEspece(espece: UIEspece): EspeceRow {
    return {
      id: espece.id,
      classe: espece.classe.libelle,
      code: espece.code,
      nomFrancais: espece.nomFrancais,
      nomLatin: espece.nomLatin,
      nbDonnees: espece.nbDonnees
    };
  }
}
