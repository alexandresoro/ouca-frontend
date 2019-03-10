import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreationComponent } from "./pages/creation/creation.component";

const routes: Routes = [
  {
    path: "",
    component: CreationComponent
  },
  {
    path: "creation",
    component: CreationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class DonneeCreationRoutingModule {}
