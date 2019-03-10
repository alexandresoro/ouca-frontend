import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { SelectDialogComponent } from "./components/select-dialog/select-dialog.component";
import { DonneeViewRoutingModule } from "./donnee-view-routing.module";
import { ViewComponent } from "./pages/view/view.component";

@NgModule({
  imports: [SharedModule, DonneeViewRoutingModule],
  declarations: [SelectDialogComponent, ViewComponent],
  entryComponents: [SelectDialogComponent],
  exports: [],
  providers: []
})
export class DonneeViewModule {}
