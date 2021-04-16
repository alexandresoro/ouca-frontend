import { CdkColumnDef } from "@angular/cdk/table";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminComponent } from './pages/admin/admin.component';
import { ConfigurationComponent } from "./pages/configuration/configuration.component";
import { DatabaseComponent } from "./pages/database/database.component";
import { DocumentationComponent } from "./pages/documentation/documentation.component";
import { ImportComponent } from "./pages/import/import.component";

const routes: Routes = [
  {
    path: "admin",
    component: AdminComponent
  },
  {
    path: "configuration",
    component: ConfigurationComponent
  },
  {
    path: "documentation",
    component: DocumentationComponent
  },
  {
    path: "import",
    component: ImportComponent
  },
  {
    path: "sauvegarde",
    component: DatabaseComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [CdkColumnDef]
})
export class ApplicationManagementRoutingModule { }
