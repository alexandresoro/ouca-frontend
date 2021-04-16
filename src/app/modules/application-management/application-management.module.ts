import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { ApplicationManagementRoutingModule } from "./application-management-routing.module";
import { ApplicationUpgradeDialog } from './components/application-upgrade-dialog/application-upgrade-dialog';
import { ConfigurationFormComponent } from "./components/configuration-form/configuration-form.component";
import { OngoingImportDialog } from './components/ongoing-import-dialog/ongoing-import-dialog.component';
import { ConfigurationComponent } from "./pages/configuration/configuration.component";
import { DatabaseComponent } from "./pages/database/database.component";
import { DocumentationComponent } from "./pages/documentation/documentation.component";
import { ImportComponent } from "./pages/import/import.component";
@NgModule({
  imports: [SharedModule, ApplicationManagementRoutingModule],
  declarations: [
    ConfigurationComponent,
    ConfigurationFormComponent,
    DatabaseComponent,
    DocumentationComponent,
    ImportComponent,
    OngoingImportDialog,
    ApplicationUpgradeDialog
  ],
  exports: [],
  providers: []
})
export class ApplicationManagementModule { }
