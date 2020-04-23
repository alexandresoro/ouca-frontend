import { Component } from "@angular/core";
import { INIT } from "ouca-common/websocket/websocket-request-message.model";
import { BackendWsService } from "./services/backend-ws.service";
import { EntitiesStoreService } from "./services/entities-store.service";

@Component({
  selector: "base-naturaliste",
  styleUrls: ["./app.component.scss"],
  templateUrl: "./app.tpl.html"
})
export class AppComponent {
  constructor(
    private entitiesStoreService: EntitiesStoreService,
    private backendWsService: BackendWsService
  ) {}

  ngOnInit(): void {
    this.backendWsService.sendMessage(INIT);
  }
}
