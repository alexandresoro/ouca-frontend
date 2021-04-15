import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { combineLatest, Observable } from "rxjs";
import { UIEspece } from "src/app/models/espece.model";
import { BackendApiService } from "src/app/services/backend-api.service";
import { EntitiesStoreService } from "src/app/services/entities-store.service";

@Component({
  selector: "charts",
  templateUrl: "./charts.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartsComponent implements OnInit {
  public especes$: Observable<UIEspece[]>;

  public currentEspece$: Observable<UIEspece>;

  public specimensBySexe: { name: string; value: number }[];

  public specimensByAge: { name: string; value: number }[];

  colorScheme = {
    domain: [
      "#DFF650",
      "#D8A0FF",
      "#98E4FF",
      "#FFFF66",
      "#FFADD6",
      "#B0F9FF",
      "#E5C8FF",
      "#FFA2A2",
      "#A6FFD9",
      "#FFD0B0",
      "#98E4FF"
    ]
  };

  constructor(
    private backendApiService: BackendApiService,
    private entitiesStoreService: EntitiesStoreService,
    private route: ActivatedRoute
  ) {
    this.especes$ = this.entitiesStoreService.getEspeces$();
  }

  ngOnInit(): void {
    this.currentEspece$ = combineLatest(
      this.route.paramMap,
      this.especes$,
      (params, especes) => {
        const id = Number(params.get("id"));
        return especes?.find((espece) => {
          return espece.id === id;
        });
      }
    );

    this.currentEspece$.subscribe((espece) => {
      // Call backend to get values
      this.backendApiService
        .getEspeceDetailsBySexe(espece.id)
        .subscribe((data) => {
          this.specimensBySexe = data;
        });

      this.backendApiService
        .getEspeceDetailsByAge(espece.id)
        .subscribe((data) => {
          this.specimensByAge = data;
        });
    });
  }

  onSelect(item: unknown): void {
    console.log("Item clicked", JSON.parse(JSON.stringify(item)));
  }

  onActivate(item: unknown): void {
    console.log("Activate", JSON.parse(JSON.stringify(item)));
  }

  onDeactivate(item: unknown): void {
    console.log("Deactivate", JSON.parse(JSON.stringify(item)));
  }
}
