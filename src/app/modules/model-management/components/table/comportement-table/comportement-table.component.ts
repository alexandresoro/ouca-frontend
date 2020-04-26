import { Component } from "@angular/core";
import { Comportement } from "ouca-common/comportement.object";
import { Observable } from "rxjs";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { EntiteAvecLibelleEtCodeTableComponent } from "../entite-avec-libelle-et-code-table/entite-avec-libelle-et-code-table.component";

@Component({
  selector: "comportement-table",
  styleUrls: [
    "../entite-avec-libelle-et-code-table/entite-avec-libelle-et-code-table.component.scss"
  ],
  templateUrl:
    "../entite-avec-libelle-et-code-table/entite-avec-libelle-et-code-table.tpl.html"
})
export class ComportementTableComponent extends EntiteAvecLibelleEtCodeTableComponent<
  Comportement
> {
  constructor(private entitiesStoreService: EntitiesStoreService) {
    super();
  }

  ngOnInit(): void {
    this.initialize();
  }

  public getEntities$ = (): Observable<Comportement[]> => {
    return this.entitiesStoreService.getComportements$();
  };
}
