import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { ApplicationManagementRoutingModule } from "./application-management-routing.module";
import { ConfigurationFormComponent } from "./components/configuration-form/configuration-form.component";
import { ConfigurationComponent } from "./pages/configuration/configuration.component";
import { ConfigurationService } from "./pages/configuration/configuration.service";
import { ImportComponent } from "./pages/import/import.component";
import { ImportService } from "./pages/import/import.service";

@NgModule({
  imports: [SharedModule, ApplicationManagementRoutingModule],
  declarations: [
    ConfigurationComponent,
    ConfigurationFormComponent,
    ImportComponent
  ],
  exports: [],
  providers: [ConfigurationService, ImportService]
})
export class ApplicationManagementModule {}
