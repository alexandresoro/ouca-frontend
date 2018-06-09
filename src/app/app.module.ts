import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { EntityMessagesComponent } from "./components/entities/messages/messages.component";
import { TableButtonsComponent } from "./components/entities/table-buttons/table-buttons.component";
import { TopButtonsComponent } from "./components/entities/top-buttons/top-buttons.component";
import { LcoInputTextComponent } from "./components/form/input-text/lco-input-text.component";
import { CreationComponent } from "./pages/creation/creation.component";
import { DonneeService } from "./pages/creation/donnee.service";
import { InputCodeLibelleComponent } from "./pages/creation/input-code-libelle/input-code-libelle.component";
import { InventaireService } from "./pages/creation/inventaire.service";
import { AgeRemovalConfirmationComponent } from "./pages/entities/age/age-delete-confirmation.component";
import { AgeDetailsComponent } from "./pages/entities/age/age-details.component";
import { AgeFormComponent } from "./pages/entities/age/age-form.component";
import { AgeTableComponent } from "./pages/entities/age/age-table.component";
import { AgeComponent } from "./pages/entities/age/age.component";
import { ClasseRemovalConfirmationComponent } from "./pages/entities/classe/classe-delete-confirmation.component";
import { ClasseDetailsComponent } from "./pages/entities/classe/classe-details.component";
import { ClasseFormComponent } from "./pages/entities/classe/classe-form.component";
import { ClasseTableComponent } from "./pages/entities/classe/classe-table.component";
import { ClasseComponent } from "./pages/entities/classe/classe.component";
import { CommuneRemovalConfirmationComponent } from "./pages/entities/commune/commune-delete-confirmation.component";
import { CommuneDetailsComponent } from "./pages/entities/commune/commune-details.component";
import { CommuneFormComponent } from "./pages/entities/commune/commune-form.component";
import { CommuneTableComponent } from "./pages/entities/commune/commune-table.component";
import { CommuneComponent } from "./pages/entities/commune/commune.component";
import { ComportementRemovalConfirmationComponent }
    from "./pages/entities/comportement/comportement-delete-confirmation.component";
import { ComportementDetailsComponent } from "./pages/entities/comportement/comportement-details.component";
import { ComportementFormComponent } from "./pages/entities/comportement/comportement-form.component";
import { ComportementTableComponent } from "./pages/entities/comportement/comportement-table.component";
import { ComportementComponent } from "./pages/entities/comportement/comportement.component";
import { DepartementRemovalConfirmationComponent }
    from "./pages/entities/departement/departement-delete-confirmation.component";
import { DepartementDetailsComponent } from "./pages/entities/departement/departement-details.component";
import { DepartementFormComponent } from "./pages/entities/departement/departement-form.component";
import { DepartementTableComponent } from "./pages/entities/departement/departement-table.component";
import { DepartementComponent } from "./pages/entities/departement/departement.component";
import { EntiteSimpleRemovalConfirmationComponent }
    from "./pages/entities/entite-simple/entite-simple-delete-confirmation.component";
import { EntiteSimpleDetailsComponent } from "./pages/entities/entite-simple/entite-simple-details.component";
import { EntiteSimpleFormComponent } from "./pages/entities/entite-simple/entite-simple-form.component";
import { EntiteSimpleComponent } from "./pages/entities/entite-simple/entite-simple.component";
import { EntiteSimpleService } from "./pages/entities/entite-simple/entite-simple.service";
import { EstimationDistanceRemovalConfirmationComponent }
    from "./pages/entities/estimation-distance/estimation-distance-delete-confirmation.component";
import { EstimationDistanceDetailsComponent }
    from "./pages/entities/estimation-distance/estimation-distance-details.component";
import { EstimationDistanceFormComponent }
    from "./pages/entities/estimation-distance/estimation-distance-form.component";
import { EstimationDistanceTableComponent }
    from "./pages/entities/estimation-distance/estimation-distance-table.component";
import { EstimationDistanceComponent } from "./pages/entities/estimation-distance/estimation-distance.component";
import { EstimationNombreRemovalConfirmationComponent }
    from "./pages/entities/estimation-nombre/estimation-nombre-delete-confirmation.component";
import { EstimationNombreDetailsComponent }
    from "./pages/entities/estimation-nombre/estimation-nombre-details.component";
import { EstimationNombreFormComponent } from "./pages/entities/estimation-nombre/estimation-nombre-form.component";
import { EstimationNombreTableComponent } from "./pages/entities/estimation-nombre/estimation-nombre-table.component";
import { EstimationNombreComponent } from "./pages/entities/estimation-nombre/estimation-nombre.component";
import { GestionModeHelper } from "./pages/entities/gestion-mode.enum";
import { MeteoRemovalConfirmationComponent } from "./pages/entities/meteo/meteo-delete-confirmation.component";
import { MeteoDetailsComponent } from "./pages/entities/meteo/meteo-details.component";
import { MeteoFormComponent } from "./pages/entities/meteo/meteo-form.component";
import { MeteoTableComponent } from "./pages/entities/meteo/meteo-table.component";
import { MeteoComponent } from "./pages/entities/meteo/meteo.component";
import { MilieuRemovalConfirmationComponent } from "./pages/entities/milieu/milieu-delete-confirmation.component";
import { MilieuDetailsComponent } from "./pages/entities/milieu/milieu-details.component";
import { MilieuFormComponent } from "./pages/entities/milieu/milieu-form.component";
import { MilieuTableComponent } from "./pages/entities/milieu/milieu-table.component";
import { MilieuComponent } from "./pages/entities/milieu/milieu.component";
import { ObservateurRemovalConfirmationComponent }
    from "./pages/entities/observateur/observateur-delete-confirmation.component";
import { ObservateurDetailsComponent } from "./pages/entities/observateur/observateur-details.component";
import { ObservateurFormComponent } from "./pages/entities/observateur/observateur-form.component";
import { ObservateurTableComponent } from "./pages/entities/observateur/observateur-table.component";
import { ObservateurComponent } from "./pages/entities/observateur/observateur.component";
import { SexeRemovalConfirmationComponent } from "./pages/entities/sexe/sexe-delete-confirmation.component";
import { SexeDetailsComponent } from "./pages/entities/sexe/sexe-details.component";
import { SexeFormComponent } from "./pages/entities/sexe/sexe-form.component";
import { SexeTableComponent } from "./pages/entities/sexe/sexe-table.component";
import { SexeComponent } from "./pages/entities/sexe/sexe.component";
import { ViewComponent } from "./pages/vue/view.component";
import { BaseNaturalisteService } from "./services/base-naturaliste.service";

import { ConfigurationFormComponent } from "./pages/configuration/configuration-form.component";
import { ConfigurationComponent } from "./pages/configuration/configuration.component";
import { ConfigurationService } from "./pages/configuration/configuration.service";
import { CreationModeHelper } from "./pages/creation/creation-mode.enum";
import { CreationService } from "./pages/creation/creation.service";
import { NavigationService } from "./pages/creation/navigation.service";
import { EspeceRemovalConfirmationComponent } from "./pages/entities/espece/espece-delete-confirmation.component";
import { EspeceDetailsComponent } from "./pages/entities/espece/espece-details.component";
import { EspeceFormComponent } from "./pages/entities/espece/espece-form.component";
import { EspeceTableComponent } from "./pages/entities/espece/espece-table.component";
import { EspeceComponent } from "./pages/entities/espece/espece.component";
import { LieuditRemovalConfirmationComponent } from "./pages/entities/lieudit/lieudit-delete-confirmation.component";
import { LieuditDetailsComponent } from "./pages/entities/lieudit/lieudit-details.component";
import { LieuditFormComponent } from "./pages/entities/lieudit/lieudit-form.component";
import { LieuditTableComponent } from "./pages/entities/lieudit/lieudit-table.component";
import { LieuditComponent } from "./pages/entities/lieudit/lieudit.component";

const baseNaturalisteRoutes: Routes = [
    {
        path: "",
        component: CreationComponent
    },
    {
        path: "creation",
        component: CreationComponent
    },
    {
        path: "vue",
        component: ViewComponent
    },
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
    }, {
        path: "configuration",
        component: ConfigurationComponent
    }
];

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(baseNaturalisteRoutes),
        HttpModule,
        FormsModule
    ],
    declarations: [
        AppComponent,
        AgeComponent,
        AgeTableComponent,
        AgeDetailsComponent,
        AgeFormComponent,
        AgeRemovalConfirmationComponent,
        ClasseComponent,
        ClasseTableComponent,
        ClasseDetailsComponent,
        ClasseFormComponent,
        ClasseRemovalConfirmationComponent,
        ConfigurationComponent,
        ConfigurationFormComponent,
        CommuneComponent,
        CommuneTableComponent,
        CommuneDetailsComponent,
        CommuneFormComponent,
        CommuneRemovalConfirmationComponent,
        ComportementComponent,
        ComportementTableComponent,
        ComportementDetailsComponent,
        ComportementFormComponent,
        ComportementRemovalConfirmationComponent,
        CreationComponent,
        DepartementComponent,
        DepartementTableComponent,
        DepartementDetailsComponent,
        DepartementFormComponent,
        DepartementRemovalConfirmationComponent,
        EntiteSimpleComponent,
        EntiteSimpleRemovalConfirmationComponent,
        EntiteSimpleDetailsComponent,
        EntiteSimpleFormComponent,
        EspeceComponent,
        EspeceTableComponent,
        EspeceDetailsComponent,
        EspeceFormComponent,
        EspeceRemovalConfirmationComponent,
        EstimationNombreComponent,
        EstimationNombreTableComponent,
        EstimationNombreDetailsComponent,
        EstimationNombreFormComponent,
        EstimationNombreRemovalConfirmationComponent,
        EstimationDistanceComponent,
        EstimationDistanceTableComponent,
        EstimationDistanceDetailsComponent,
        EstimationDistanceFormComponent,
        EstimationDistanceRemovalConfirmationComponent,
        InputCodeLibelleComponent,
        LieuditComponent,
        LieuditTableComponent,
        LieuditDetailsComponent,
        LieuditFormComponent,
        LieuditRemovalConfirmationComponent,
        MeteoComponent,
        MeteoTableComponent,
        MeteoDetailsComponent,
        MeteoFormComponent,
        MeteoRemovalConfirmationComponent,
        MilieuComponent,
        MilieuTableComponent,
        MilieuDetailsComponent,
        MilieuFormComponent,
        MilieuRemovalConfirmationComponent,
        ObservateurComponent,
        ObservateurTableComponent,
        ObservateurDetailsComponent,
        ObservateurFormComponent,
        ObservateurRemovalConfirmationComponent,
        SexeComponent,
        SexeTableComponent,
        SexeDetailsComponent,
        SexeFormComponent,
        SexeRemovalConfirmationComponent,
        TopButtonsComponent,
        TableButtonsComponent,
        LcoInputTextComponent,
        EntityMessagesComponent,
        ViewComponent
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        BaseNaturalisteService,
        ConfigurationService,
        CreationModeHelper,
        CreationService,
        DonneeService,
        EntiteSimpleService,
        GestionModeHelper,
        InventaireService,
        NavigationService,
    ]
})
export class AppModule {
}