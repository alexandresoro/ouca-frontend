import { Component, OnInit } from "@angular/core";
import { INIT } from "ouca-common/websocket/websocket-request-message.model";
import { AppConfigurationService } from "./services/app-configuration.service";
import { BackendWsService } from "./services/backend-ws.service";
import { EntitiesStoreService } from "./services/entities-store.service";

@Component({
  selector: "base-naturaliste",
  styleUrls: ["./app.component.scss"],
  templateUrl: "./app.tpl.html"
})
export class AppComponent implements OnInit {
  constructor(
    private backendWsService: BackendWsService,
    private appConfigurationService: AppConfigurationService,
    private entitiesStoreService: EntitiesStoreService
  ) {}

  ngOnInit(): void {
    this.appConfigurationService.initializeConfigurationStore();
    this.entitiesStoreService.initializeEntitiesStore();
    this.backendWsService.sendMessage(INIT);
  }
}
