import { Component } from "@angular/core";
import { Departement } from "ouca-common/departement.object";
import { Observable } from "rxjs";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { EntiteSimpleTableComponent } from "../entite-simple-table/entite-simple-table.component";

@Component({
  selector: "departement-table",
  styleUrls: ["./departement-table.component.scss"],
  templateUrl: "./departement-table.tpl.html"
})
export class DepartementTableComponent extends EntiteSimpleTableComponent<
  Departement
> {
  public displayedColumns: string[] = [
    "code",
    "nbCommunes",
    "nbLieuxdits",
    "nbDonnees"
  ];

  constructor(private entitiesStoreService: EntitiesStoreService) {
    super();
  }

  ngOnInit(): void {
    this.initialize();
  }

  public getEntities$ = (): Observable<Departement[]> => {
    return this.entitiesStoreService.getDepartements$();
  };
}
