import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { SearchComponent } from "./components/search/search.component";
import { TableDonneesComponent } from "./components/table-donnees/table-donnees.component";
import { TableEspecesWithNbDonneesComponent } from "./components/table-especes-with-nb-donnees/table-especes-with-nb-donnees.component";
import { DonneeViewRoutingModule } from "./donnee-view-routing.module";
import { ViewComponent } from "./pages/view/view.component";

@NgModule({
  imports: [SharedModule, DonneeViewRoutingModule],
  declarations: [
    SearchComponent,
    TableDonneesComponent,
    TableEspecesWithNbDonneesComponent,
    ViewComponent
  ],
  entryComponents: [],
  exports: [],
  providers: []
})
export class DonneeViewModule {}
