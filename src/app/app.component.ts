import { Component } from "@angular/core";
import { AppConfigurationService } from "./services/app-configuration.service";
import { BackendWsService } from "./services/backend-ws.service";
import { EntitiesStoreService } from "./services/entities-store.service";

@Component({
  selector: "base-naturaliste",
  styleUrls: ["./app.component.scss"],
  templateUrl: "./app.tpl.html"
})
export class AppComponent {
  constructor(
    private appConfigurationService: AppConfigurationService,
    private entitiesStoreService: EntitiesStoreService,
    private backendWsService: BackendWsService
  ) {}

  ngOnInit(): void {
    this.entitiesStoreService.updateAllEntities();
  }
}
