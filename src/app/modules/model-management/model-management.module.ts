import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { EntityMessagesComponent } from "./components/messages/messages.component";
import { TableButtonsComponent } from "./components/table-buttons/table-buttons.component";
import { TableTopbarComponent } from "./components/table-topbar/table-topbar.component";
import { AgeTableComponent } from "./components/table/age-table/age-table.component";
import { ClasseTableComponent } from "./components/table/classe-table/classe-table.component";
import { CommuneTableComponent } from "./components/table/commune-table/commune-table.component";
import { ComportementTableComponent } from "./components/table/comportement-table/comportement-table.component";
import { DepartementTableComponent } from "./components/table/departement-table/departement-table.component";
import { EntiteAvecLibelleEtCodeTableComponent } from "./components/table/entite-avec-libelle-et-code-table/entite-avec-libelle-et-code-table.component";
import { EntiteAvecLibelleTableComponent } from "./components/table/entite-avec-libelle-table/entite-avec-libelle-table.component";
import { EntiteSimpleTableComponent } from "./components/table/entite-simple-table/entite-simple-table.component";
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
import { AgeComponent } from "./pages/age/age.component";
import { ClasseComponent } from "./pages/classe/classe.component";
import { CommuneFormComponent } from "./pages/commune/commune-form.component";
import { CommuneComponent } from "./pages/commune/commune.component";
import { ComportementComponent } from "./pages/comportement/comportement.component";
import { DepartementFormComponent } from "./pages/departement/departement-form.component";
import { DepartementComponent } from "./pages/departement/departement.component";
import { EntiteAvecLibelleEtCodeFormComponent } from "./pages/entite-avec-libelle-et-code/entite-avec-libelle-et-code-form.component";
import { EntiteAvecLibelleEtCodeComponent } from "./pages/entite-avec-libelle-et-code/entite-avec-libelle-et-code.component";
import { EntiteAvecLibelleFormComponent } from "./pages/entite-avec-libelle/entite-avec-libelle-form.component";
import { EntiteAvecLibelleComponent } from "./pages/entite-avec-libelle/entite-avec-libelle.component";
import { EntiteSimpleRemovalConfirmationComponent } from "./pages/entite-simple/entite-simple-delete-confirmation.component";
import { EntiteSimpleDetailsComponent } from "./pages/entite-simple/entite-simple-details.component";
import { EntiteSimpleFormComponent } from "./pages/entite-simple/entite-simple-form.component";
import { EntiteSimpleComponent } from "./pages/entite-simple/entite-simple.component";
import { EntiteSimpleService } from "./pages/entite-simple/entite-simple.service";
import { EspeceFormComponent } from "./pages/espece/espece-form.component";
import { EspeceComponent } from "./pages/espece/espece.component";
import { EstimationDistanceComponent } from "./pages/estimation-distance/estimation-distance.component";
import { EstimationNombreFormComponent } from "./pages/estimation-nombre/estimation-nombre-form.component";
import { EstimationNombreComponent } from "./pages/estimation-nombre/estimation-nombre.component";
import { GestionModeHelper } from "./pages/gestion-mode.enum";
import { LieuditFormComponent } from "./pages/lieudit/lieudit-form.component";
import { LieuditComponent } from "./pages/lieudit/lieudit.component";
import { MeteoComponent } from "./pages/meteo/meteo.component";
import { MilieuComponent } from "./pages/milieu/milieu.component";
import { ObservateurComponent } from "./pages/observateur/observateur.component";
import { SexeComponent } from "./pages/sexe/sexe.component";

@NgModule({
  imports: [SharedModule, ModelManagementRoutingModule],
  declarations: [
    AgeComponent,
    AgeTableComponent,
    ClasseComponent,
    ClasseTableComponent,
    CommuneComponent,
    CommuneFormComponent,
    CommuneTableComponent,
    ComportementComponent,
    ComportementTableComponent,
    DepartementComponent,
    DepartementFormComponent,
    DepartementTableComponent,
    EntiteAvecLibelleComponent,
    EntiteAvecLibelleFormComponent,
    EntiteAvecLibelleTableComponent,
    EntiteAvecLibelleEtCodeComponent,
    EntiteAvecLibelleEtCodeFormComponent,
    EntiteAvecLibelleEtCodeTableComponent,
    EntiteSimpleComponent,
    EntiteSimpleDetailsComponent,
    EntiteSimpleFormComponent,
    EntiteSimpleRemovalConfirmationComponent,
    EntiteSimpleTableComponent,
    EntityMessagesComponent,
    EspeceComponent,
    EspeceFormComponent,
    EspeceTableComponent,
    EstimationDistanceComponent,
    EstimationDistanceTableComponent,
    EstimationNombreComponent,
    EstimationNombreFormComponent,
    EstimationNombreTableComponent,
    LieuditComponent,
    LieuditFormComponent,
    LieuditTableComponent,
    MeteoComponent,
    MeteoTableComponent,
    MilieuComponent,
    MilieuTableComponent,
    ObservateurComponent,
    ObservateurTableComponent,
    SexeComponent,
    SexeTableComponent,
    TableButtonsComponent,
    TableTopbarComponent,
    TopButtonsComponent
  ],
  entryComponents: [],
  exports: [],
  providers: [EntiteSimpleService, GestionModeHelper]
})
export class ModelManagementModule {}
