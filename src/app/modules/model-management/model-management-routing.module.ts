import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AgeComponent } from "./pages/age/age.component";
import { ClasseComponent } from "./pages/classe/classe.component";
import { CommuneComponent } from "./pages/commune/commune.component";
import { ComportementComponent } from "./pages/comportement/comportement.component";
import { DepartementComponent } from "./pages/departement/departement.component";
import { EspeceComponent } from "./pages/espece/espece.component";
import { EstimationDistanceComponent } from "./pages/estimation-distance/estimation-distance.component";
import { EstimationNombreComponent } from "./pages/estimation-nombre/estimation-nombre.component";
import { LieuditComponent } from "./pages/lieudit/lieudit.component";
import { MeteoComponent } from "./pages/meteo/meteo.component";
import { MilieuComponent } from "./pages/milieu/milieu.component";
import { ObservateurComponent } from "./pages/observateur/observateur.component";
import { SexeComponent } from "./pages/sexe/sexe.component";

const routes: Routes = [
  {
    path: "age",
    component: AgeComponent
  },
  {
    path: "classe",
    component: ClasseComponent
  },
  {
    path: "commune",
    component: CommuneComponent
  },
  {
    path: "comportement",
    component: ComportementComponent
  },
  {
    path: "departement",
    component: DepartementComponent
  },
  {
    path: "espece",
    component: EspeceComponent
  },
  {
    path: "estimation-nombre",
    component: EstimationNombreComponent
  },
  {
    path: "estimation-distance",
    component: EstimationDistanceComponent
  },
  {
    path: "lieudit",
    component: LieuditComponent
  },
  {
    path: "meteo",
    component: MeteoComponent
  },
  {
    path: "milieu",
    component: MilieuComponent
  },
  {
    path: "observateur",
    component: ObservateurComponent
  },
  {
    path: "sexe",
    component: SexeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class ModelManagementRoutingModule {}
