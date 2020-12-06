import { CdkColumnDef } from "@angular/cdk/table";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ConfigurationComponent } from "./pages/configuration/configuration.component";
import { DatabaseComponent } from "./pages/database/database.component";
import { DocumentationComponent } from "./pages/documentation/documentation.component";
import { ImportComponent } from "./pages/import/import.component";

const routes: Routes = [
  {
    path: "configuration",
    component: ConfigurationComponent
  },
  {
    path: "import",
    component: ImportComponent
  },
  {
    path: "sauvegarde",
    component: DatabaseComponent
  },
  {
    path: "documentation",
    component: DocumentationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [CdkColumnDef]
})
export class ApplicationManagementRoutingModule {}
