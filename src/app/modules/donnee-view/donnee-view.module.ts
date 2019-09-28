import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { TableDonneesComponent } from "./components/table-donnees/table-donnees.component";
import { DonneeViewRoutingModule } from "./donnee-view-routing.module";
import { ViewComponent } from "./pages/view/view.component";
import { TableEspecesWithNbDonneesComponent } from "./components/table-especes-with-nb-donnees/table-especes-with-nb-donnees.component";

@NgModule({
  imports: [SharedModule, DonneeViewRoutingModule],
  declarations: [
    TableDonneesComponent,
    TableEspecesWithNbDonneesComponent,
    ViewComponent
  ],
  entryComponents: [],
  exports: [],
  providers: []
})
export class DonneeViewModule {}
