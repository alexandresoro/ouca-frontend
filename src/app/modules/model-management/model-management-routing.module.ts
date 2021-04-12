import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ChartsComponent } from "./components/charts/charts.component";
import { AgeEditComponent } from "./pages/age/age-edit.component";
import { AgeComponent } from "./pages/age/age.component";
import { ClasseEditComponent } from "./pages/classe/classe-edit.component";
import { ClasseComponent } from "./pages/classe/classe.component";
import { CommuneEditComponent } from "./pages/commune/commune-edit.component";
import { CommuneComponent } from "./pages/commune/commune.component";
import { ComportementEditComponent } from "./pages/comportement/comportement-edit.component";
import { ComportementComponent } from "./pages/comportement/comportement.component";
import { DepartementEditComponent } from "./pages/departement/departement-edit.component";
import { DepartementComponent } from "./pages/departement/departement.component";
import { EspeceEditComponent } from "./pages/espece/espece-edit.component";
import { EspeceComponent } from "./pages/espece/espece.component";
import { EstimationDistanceEditComponent } from "./pages/estimation-distance/estimation-distance-edit.component";
import { EstimationDistanceComponent } from "./pages/estimation-distance/estimation-distance.component";
import { EstimationNombreEditComponent } from "./pages/estimation-nombre/estimation-nombre-edit.component";
import { EstimationNombreComponent } from "./pages/estimation-nombre/estimation-nombre.component";
import { LieuDitEditComponent } from "./pages/lieudit/lieu-dit-edit.component";
import { LieuditComponent } from "./pages/lieudit/lieudit.component";
import { MeteoEditComponent } from "./pages/meteo/meteo-edit.component";
import { MeteoComponent } from "./pages/meteo/meteo.component";
import { MilieuEditComponent } from "./pages/milieu/milieu-edit.component";
import { MilieuComponent } from "./pages/milieu/milieu.component";
import { ObservateurEditComponent } from "./pages/observateur/observateur-edit.component";
import { ObservateurComponent } from "./pages/observateur/observateur.component";
import { SexeEditComponent } from "./pages/sexe/sexe-edit.component";
import { SexeComponent } from "./pages/sexe/sexe.component";

const routes: Routes = [
  {
    path: "age",
    component: AgeComponent
  },
  {
    path: "age/create",
    component: AgeEditComponent,
    data: {
      isEditingMode: false
    }
  },
  {
    path: "age/edit/:id",
    component: AgeEditComponent,
    data: {
      isEditingMode: true
    }
  },
  {
    path: "classe",
    component: ClasseComponent
  },
  {
    path: "classe/create",
    component: ClasseEditComponent,
    data: {
      isEditingMode: false
    }
  },
  {
    path: "classe/edit/:id",
    component: ClasseEditComponent,
    data: {
      isEditingMode: true
    }
  },
  {
    path: "commune",
    component: CommuneComponent
  },
  {
    path: "commune/create",
    component: CommuneEditComponent,
    data: {
      isEditingMode: false
    }
  },
  {
    path: "commune/edit/:id",
    component: CommuneEditComponent,
    data: {
      isEditingMode: true
    }
  },
  {
    path: "comportement",
    component: ComportementComponent
  },
  {
    path: "comportement/create",
    component: ComportementEditComponent,
    data: {
      isEditingMode: false
    }
  },
  {
    path: "comportement/edit/:id",
    component: ComportementEditComponent,
    data: {
      isEditingMode: true
    }
  },
  {
    path: "departement",
    component: DepartementComponent
  },
  {
    path: "departement/create",
    component: DepartementEditComponent,
    data: {
      isEditingMode: false
    }
  },
  {
    path: "departement/edit/:id",
    component: DepartementEditComponent,
    data: {
      isEditingMode: true
    }
  },
  {
    path: "espece",
    component: EspeceComponent
  },
  {
    path: "espece/create",
    component: EspeceEditComponent,
    data: {
      isEditingMode: false
    }
  },
  {
    path: "espece/edit/:id",
    component: EspeceEditComponent,
    data: {
      isEditingMode: true
    }
  },
  {
    path: "espece/details/:id",
    component: ChartsComponent
  },
  {
    path: "estimation-nombre",
    component: EstimationNombreComponent
  },
  {
    path: "estimation-nombre/create",
    component: EstimationNombreEditComponent,
    data: {
      isEditingMode: false
    }
  },
  {
    path: "estimation-nombre/edit/:id",
    component: EstimationNombreEditComponent,
    data: {
      isEditingMode: true
    }
  },
  {
    path: "estimation-distance",
    component: EstimationDistanceComponent
  },
  {
    path: "estimation-distance/create",
    component: EstimationDistanceEditComponent,
    data: {
      isEditingMode: false
    }
  },
  {
    path: "estimation-distance/edit/:id",
    component: EstimationDistanceEditComponent,
    data: {
      isEditingMode: true
    }
  },
  {
    path: "lieudit",
    component: LieuditComponent
  },
  {
    path: "lieudit/create",
    component: LieuDitEditComponent,
    data: {
      isEditingMode: false
    }
  },
  {
    path: "lieudit/edit/:id",
    component: LieuDitEditComponent,
    data: {
      isEditingMode: true
    }
  },
  {
    path: "meteo",
    component: MeteoComponent
  },
  {
    path: "meteo/create",
    component: MeteoEditComponent,
    data: {
      isEditingMode: false
    }
  },
  {
    path: "meteo/edit/:id",
    component: MeteoEditComponent,
    data: {
      isEditingMode: true
    }
  },
  {
    path: "milieu",
    component: MilieuComponent
  },
  {
    path: "milieu/create",
    component: MilieuEditComponent,
    data: {
      isEditingMode: false
    }
  },
  {
    path: "milieu/edit/:id",
    component: MilieuEditComponent,
    data: {
      isEditingMode: true
    }
  },
  {
    path: "observateur",
    component: ObservateurComponent
  },
  {
    path: "observateur/create",
    component: ObservateurEditComponent,
    data: {
      isEditingMode: false
    }
  },
  {
    path: "observateur/edit/:id",
    component: ObservateurEditComponent,
    data: {
      isEditingMode: true
    }
  },
  {
    path: "sexe",
    component: SexeComponent
  },
  {
    path: "sexe/create",
    component: SexeEditComponent,
    data: {
      isEditingMode: false
    }
  },
  {
    path: "sexe/edit/:id",
    component: SexeEditComponent,
    data: {
      isEditingMode: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: []
})
export class ModelManagementRoutingModule {}
