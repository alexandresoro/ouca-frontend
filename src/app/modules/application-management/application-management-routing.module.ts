import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ConfigurationComponent } from "./pages/configuration/configuration.component";
import { ImportComponent } from "./pages/import/import.component";

const routes: Routes = [
  {
    path: "configuration",
    component: ConfigurationComponent
  },
  {
    path: "import",
    component: ImportComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class ApplicationManagementRoutingModule {}
