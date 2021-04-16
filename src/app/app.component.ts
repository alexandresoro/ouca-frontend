import { Component, OnInit } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { filter, map } from 'rxjs/operators';
import { INIT } from './model/websocket/websocket-message-type.model';
import { ApplicationUpgradeDialog } from './modules/application-management/components/application-upgrade-dialog/application-upgrade-dialog';
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
    private entitiesStoreService: EntitiesStoreService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.appConfigurationService.initializeConfigurationStore();
    this.entitiesStoreService.initializeEntitiesStore();
    this.backendWsService.getUpdateMessageContent$().pipe(
      filter(updateMessage => !!(updateMessage?.version)),
      map(updateMessage => updateMessage.version)
    ).subscribe((appVersion) => {
      // Check that the database and app versions are matching
      // If it is the case, do nothing, otherwise, display the migration dialog
      if (appVersion.application > appVersion.database) {
        this.dialog.open(ApplicationUpgradeDialog, {
          data: appVersion,
          width: "800px",
          hasBackdrop: true,
          disableClose: true
        });
      }
    });
    this.backendWsService.sendMessage({ type: INIT });
  }
}
