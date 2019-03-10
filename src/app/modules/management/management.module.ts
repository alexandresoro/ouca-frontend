import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { ConfigurationFormComponent } from "./components/configuration-form/configuration-form.component";
import { ManagementRoutingModule } from "./management-routing.module";
import { ConfigurationComponent } from "./pages/configuration/configuration.component";
import { ConfigurationService } from "./pages/configuration/configuration.service";
import { ImportComponent } from "./pages/import/import.component";
import { ImportService } from "./pages/import/import.service";

@NgModule({
  imports: [SharedModule, ManagementRoutingModule],
  declarations: [
    ConfigurationComponent,
    ConfigurationFormComponent,
    ImportComponent
  ],
  exports: [],
  providers: [ConfigurationService, ImportService]
})
export class ManagementModule {}
