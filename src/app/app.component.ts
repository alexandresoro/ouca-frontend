import { Component, OnInit } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { ApplicationUpgradeDialog } from './modules/application-management/components/application-upgrade-dialog/application-upgrade-dialog';
import { AppVersionGetService } from "./services/app-version-get.service";

@Component({
  selector: "base-naturaliste",
  styleUrls: ["./app.component.scss"],
  templateUrl: "./app.tpl.html"
})
export class AppComponent implements OnInit {
  constructor(
    private appVersionGetService: AppVersionGetService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
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
  }
}
