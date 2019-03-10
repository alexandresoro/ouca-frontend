import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { EntityMessagesComponent } from "./components/messages/messages.component";
import { TableButtonsComponent } from "./components/table-buttons/table-buttons.component";
import { TableTopbarComponent } from "./components/table-topbar/table-topbar.component";
import { TopButtonsComponent } from "./components/top-buttons/top-buttons.component";
import { ModelManagementRoutingModule } from "./model-management-routing.module";
import { AgeTableComponent } from "./pages/age/age-table.component";
import { AgeComponent } from "./pages/age/age.component";
import { ClasseTableComponent } from "./pages/classe/classe-table.component";
import { ClasseComponent } from "./pages/classe/classe.component";
import { CommuneFormComponent } from "./pages/commune/commune-form.component";
import { CommuneTableComponent } from "./pages/commune/commune-table.component";
import { CommuneComponent } from "./pages/commune/commune.component";
import { ComportementTableComponent } from "./pages/comportement/comportement-table.component";
import { ComportementComponent } from "./pages/comportement/comportement.component";
import { DepartementFormComponent } from "./pages/departement/departement-form.component";
import { DepartementTableComponent } from "./pages/departement/departement-table.component";
import { DepartementComponent } from "./pages/departement/departement.component";
import { EntiteAvecLibelleEtCodeFormComponent } from "./pages/entite-avec-libelle-et-code/entite-avec-libelle-et-code-form.component";
import { EntiteAvecLibelleEtCodeTableComponent } from "./pages/entite-avec-libelle-et-code/entite-avec-libelle-et-code-table.component";
import { EntiteAvecLibelleEtCodeComponent } from "./pages/entite-avec-libelle-et-code/entite-avec-libelle-et-code.component";
import { EntiteAvecLibelleFormComponent } from "./pages/entite-avec-libelle/entite-avec-libelle-form.component";
import { EntiteAvecLibelleTableComponent } from "./pages/entite-avec-libelle/entite-avec-libelle-table.component";
import { EntiteAvecLibelleComponent } from "./pages/entite-avec-libelle/entite-avec-libelle.component";
import { EntiteSimpleRemovalConfirmationComponent } from "./pages/entite-simple/entite-simple-delete-confirmation.component";
import { EntiteSimpleDetailsComponent } from "./pages/entite-simple/entite-simple-details.component";
import { EntiteSimpleFormComponent } from "./pages/entite-simple/entite-simple-form.component";
import { EntiteSimpleTableComponent } from "./pages/entite-simple/entite-simple-table.component";
import { EntiteSimpleComponent } from "./pages/entite-simple/entite-simple.component";
import { EntiteSimpleService } from "./pages/entite-simple/entite-simple.service";
import { EspeceFormComponent } from "./pages/espece/espece-form.component";
import { EspeceTableComponent } from "./pages/espece/espece-table.component";
import { EspeceComponent } from "./pages/espece/espece.component";
import { EstimationDistanceTableComponent } from "./pages/estimation-distance/estimation-distance-table.component";
import { EstimationDistanceComponent } from "./pages/estimation-distance/estimation-distance.component";
import { EstimationNombreFormComponent } from "./pages/estimation-nombre/estimation-nombre-form.component";
import { EstimationNombreTableComponent } from "./pages/estimation-nombre/estimation-nombre-table.component";
import { EstimationNombreComponent } from "./pages/estimation-nombre/estimation-nombre.component";
import { GestionModeHelper } from "./pages/gestion-mode.enum";
import { LieuditFormComponent } from "./pages/lieudit/lieudit-form.component";
import { LieuditTableComponent } from "./pages/lieudit/lieudit-table.component";
import { LieuditComponent } from "./pages/lieudit/lieudit.component";
import { MeteoTableComponent } from "./pages/meteo/meteo-table.component";
import { MeteoComponent } from "./pages/meteo/meteo.component";
import { MilieuTableComponent } from "./pages/milieu/milieu-table.component";
import { MilieuComponent } from "./pages/milieu/milieu.component";
import { ObservateurTableComponent } from "./pages/observateur/observateur-table.component";
import { ObservateurComponent } from "./pages/observateur/observateur.component";
import { SexeTableComponent } from "./pages/sexe/sexe-table.component";
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
