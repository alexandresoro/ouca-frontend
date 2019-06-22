import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { ApplicationManagementRoutingModule } from "./application-management-routing.module";
import { ConfigurationFormComponent } from "./components/configuration-form/configuration-form.component";
import { ConfigurationComponent } from "./pages/configuration/configuration.component";
import { DatabaseComponent } from "./pages/database/database.component";
import { ImportComponent } from "./pages/import/import.component";
import { UpgradeAppComponent } from "./pages/upgrade-app/upgrade-app.component";
@NgModule({
  imports: [SharedModule, ApplicationManagementRoutingModule],
  declarations: [
    ConfigurationComponent,
    ConfigurationFormComponent,
    DatabaseComponent,
    ImportComponent,
    UpgradeAppComponent
  ],
  exports: [],
  providers: []
})
export class ApplicationManagementModule {}
