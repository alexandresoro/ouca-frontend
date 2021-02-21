import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Milieu } from "@ou-ca/ouca-model";
import { Observable } from "rxjs";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { EntiteAvecLibelleEtCodeTableComponent } from "../entite-avec-libelle-et-code-table/entite-avec-libelle-et-code-table.component";

@Component({
  selector: "milieu-table",
  styleUrls: [
    "../entite-avec-libelle-et-code-table/entite-avec-libelle-et-code-table.component.scss"
  ],
  templateUrl:
    "../entite-avec-libelle-et-code-table/entite-avec-libelle-et-code-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MilieuTableComponent extends EntiteAvecLibelleEtCodeTableComponent<
Milieu
> {
  constructor(private entitiesStoreService: EntitiesStoreService) {
    super();
  }

  ngOnInit(): void {
    this.initialize();
  }

  public getEntities$ = (): Observable<Milieu[]> => {
    return this.entitiesStoreService.getMilieux$();
  };
}
