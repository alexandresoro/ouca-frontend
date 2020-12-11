import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { ChartsComponent } from "./components/charts/charts.component";
import { CommuneFormComponent } from "./components/form/commune-form/commune-form.component";
import { DepartementFormComponent } from "./components/form/departement-form/departement-form.component";
import { EntiteAvecLibelleEtCodeFormComponent } from "./components/form/entite-avec-libelle-et-code-form/entite-avec-libelle-et-code-form.component";
import { EntiteAvecLibelleFormComponent } from "./components/form/entite-avec-libelle-form/entite-avec-libelle-form.component";
import { EntityFormComponent } from "./components/form/entite-simple-form/entity-form.component";
import { EntitySubFormComponent } from "./components/form/entite-simple-form/entity-sub-form.component";
import { EntitySubFormDirective } from "./components/form/entite-simple-form/entity-sub-form.directive";
import { EspeceFormComponent } from "./components/form/espece-form/espece-form.component";
import { EstimationNombreFormComponent } from "./components/form/estimation-nombre-form/estimation-nombre-form.component";
import { TableTopbarComponent } from "./components/table-topbar/table-topbar.component";
import { AgeTableComponent } from "./components/table/age-table/age-table.component";
import { ClasseTableComponent } from "./components/table/classe-table/classe-table.component";
import { CommuneTableComponent } from "./components/table/commune-table/commune-table.component";
import { ComportementTableComponent } from "./components/table/comportement-table/comportement-table.component";
import { DepartementTableComponent } from "./components/table/departement-table/departement-table.component";
import { EspeceTableComponent } from "./components/table/espece-table/espece-table.component";
import { EstimationDistanceTableComponent } from "./components/table/estimation-distance-table/estimation-distance-table.component";
import { EstimationNombreTableComponent } from "./components/table/estimation-nombre-table/estimation-nombre-table.component";
import { LieuditTableComponent } from "./components/table/lieudit-table/lieudit-table.component";
import { MeteoTableComponent } from "./components/table/meteo-table/meteo-table.component";
import { MilieuTableComponent } from "./components/table/milieu-table/milieu-table.component";
import { ObservateurTableComponent } from "./components/table/observateur-table/observateur-table.component";
import { SexeTableComponent } from "./components/table/sexe-table/sexe-table.component";
import { TopButtonsComponent } from "./components/top-buttons/top-buttons.component";
import { ModelManagementRoutingModule } from "./model-management-routing.module";
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

@NgModule({
  imports: [SharedModule, ModelManagementRoutingModule],
  declarations: [
    AgeComponent,
    AgeEditComponent,
    AgeTableComponent,
    ClasseComponent,
    ClasseEditComponent,
    ClasseTableComponent,
    ChartsComponent,
    CommuneComponent,
    CommuneFormComponent,
    CommuneEditComponent,
    CommuneTableComponent,
    ComportementComponent,
    ComportementEditComponent,
    ComportementTableComponent,
    DepartementComponent,
    DepartementEditComponent,
    DepartementFormComponent,
    DepartementTableComponent,
    EntiteAvecLibelleFormComponent,
    EntiteAvecLibelleEtCodeFormComponent,
    EntityFormComponent,
    EntitySubFormDirective,
    EntitySubFormComponent,
    EspeceComponent,
    EspeceEditComponent,
    EspeceFormComponent,
    EspeceTableComponent,
    EstimationDistanceComponent,
    EstimationDistanceEditComponent,
    EstimationDistanceTableComponent,
    EstimationNombreComponent,
    EstimationNombreEditComponent,
    EstimationNombreFormComponent,
    EstimationNombreTableComponent,
    LieuditComponent,
    LieuDitEditComponent,
    LieuditTableComponent,
    MeteoComponent,
    MeteoEditComponent,
    MeteoTableComponent,
    MilieuComponent,
    MilieuEditComponent,
    MilieuTableComponent,
    ObservateurComponent,
    ObservateurEditComponent,
    ObservateurTableComponent,
    SexeComponent,
    SexeEditComponent,
    SexeTableComponent,
    TableTopbarComponent,
    TopButtonsComponent
  ],
  exports: [],
  providers: []
})
export class ModelManagementModule { }
