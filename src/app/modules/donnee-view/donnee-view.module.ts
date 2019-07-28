import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { TableDonneesComponent } from "./components/table-donnees/table-donnees.component";
import { DonneeViewRoutingModule } from "./donnee-view-routing.module";
import { ViewComponent } from "./pages/view/view.component";

@NgModule({
  imports: [SharedModule, DonneeViewRoutingModule],
  declarations: [TableDonneesComponent, ViewComponent],
  entryComponents: [],
  exports: [],
  providers: []
})
export class DonneeViewModule {}
