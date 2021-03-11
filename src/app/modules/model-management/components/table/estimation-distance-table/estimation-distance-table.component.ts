import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Observable } from "rxjs";
import { EstimationDistance } from 'src/app/model/types/estimation-distance.object';
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { EntiteAvecLibelleTableComponent } from "../entite-avec-libelle-table/entite-avec-libelle-table.component";

@Component({
  selector: "estimation-distance-table",
  styleUrls: [
    "../entite-avec-libelle-table/entite-avec-libelle-table.component.scss"
  ],
  templateUrl:
    "../entite-avec-libelle-table/entite-avec-libelle-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstimationDistanceTableComponent extends EntiteAvecLibelleTableComponent<
EstimationDistance
> {
  constructor(private entitiesStoreService: EntitiesStoreService) {
    super();
  }

  ngOnInit(): void {
    this.initialize();
  }

  public getEntities$ = (): Observable<EstimationDistance[]> => {
    return this.entitiesStoreService.getEstimationDistances$();
  };
}
