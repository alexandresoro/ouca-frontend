import { Component } from "@angular/core";
import { first } from "rxjs/operators";
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
    this.backendWsService
      .getIsWebsocketOpen$()
      .pipe(first((isOpen) => isOpen))
      .subscribe(() => {
        // Request initial configuration
        this.backendWsService.sendMessage("init");
      });

    this.entitiesStoreService.updateAllEntities();
  }
}
