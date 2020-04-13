import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ConfigurationComponent } from "./pages/configuration/configuration.component";
import { DatabaseComponent } from "./pages/database/database.component";
import { ImportComponent } from "./pages/import/import.component";

const routes: Routes = [
  {
    path: "configuration",
    component: ConfigurationComponent,
  },
  {
    path: "import",
    component: ImportComponent,
  },
  {
    path: "sauvegarde",
    component: DatabaseComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class ApplicationManagementRoutingModule {}
