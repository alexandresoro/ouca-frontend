import { Component, OnInit } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { INIT } from './model/websocket/websocket-message-type.model';
import { ApplicationUpgradeDialog } from './modules/application-management/components/application-upgrade-dialog/application-upgrade-dialog';
import { AppVersionGetService } from "./services/app-version-get.service";
import { BackendWsService } from "./services/backend-ws.service";
import { EntitiesStoreService } from "./services/entities-store.service";

@Component({
  selector: "base-naturaliste",
  styleUrls: ["./app.component.scss"],
  templateUrl: "./app.tpl.html"
})
export class AppComponent implements OnInit {
  constructor(
    private appVersionGetService: AppVersionGetService,
    private backendWsService: BackendWsService,
    private entitiesStoreService: EntitiesStoreService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.entitiesStoreService.initializeEntitiesStore();
    this.appVersionGetService.fetch().subscribe(({ data }) => {
      // Check that the database and app versions are matching
      // If it is the case, do nothing, otherwise, display the migration dialog
      if (data.version.application > data.version.database) {
        this.dialog.open(ApplicationUpgradeDialog, {
          data: data.version,
          width: "800px",
          hasBackdrop: true,
          disableClose: true
        });
      }
    });
    this.backendWsService.sendMessage({ type: INIT });
  }
}
