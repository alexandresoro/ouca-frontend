import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
import { AgeTableComponent } from "./pages/entities/age/age-table.component";
import { AgeComponent } from "./pages/entities/age/age.component";
import { ClasseTableComponent } from "./pages/entities/classe/classe-table.component";
import { ClasseComponent } from "./pages/entities/classe/classe.component";
import { CommuneFormComponent } from "./pages/entities/commune/commune-form.component";
import { CommuneTableComponent } from "./pages/entities/commune/commune-table.component";
import { CommuneComponent } from "./pages/entities/commune/commune.component";
import { ComportementTableComponent } from "./pages/entities/comportement/comportement-table.component";
import { ComportementComponent } from "./pages/entities/comportement/comportement.component";
import { DepartementFormComponent } from "./pages/entities/departement/departement-form.component";
import { DepartementTableComponent } from "./pages/entities/departement/departement-table.component";
import { DepartementComponent } from "./pages/entities/departement/departement.component";
import { EntiteSimpleRemovalConfirmationComponent } from "./pages/entities/entite-simple/entite-simple-delete-confirmation.component";
import { EntiteSimpleDetailsComponent } from "./pages/entities/entite-simple/entite-simple-details.component";
import { EntiteSimpleFormComponent } from "./pages/entities/entite-simple/entite-simple-form.component";
import { EntiteSimpleComponent } from "./pages/entities/entite-simple/entite-simple.component";
import { EntiteSimpleService } from "./pages/entities/entite-simple/entite-simple.service";
import { EstimationDistanceTableComponent } from "./pages/entities/estimation-distance/estimation-distance-table.component";
import { EstimationDistanceComponent } from "./pages/entities/estimation-distance/estimation-distance.component";
import { EstimationNombreFormComponent } from "./pages/entities/estimation-nombre/estimation-nombre-form.component";
import { EstimationNombreTableComponent } from "./pages/entities/estimation-nombre/estimation-nombre-table.component";
import { EstimationNombreComponent } from "./pages/entities/estimation-nombre/estimation-nombre.component";
import { GestionModeHelper } from "./pages/entities/gestion-mode.enum";
import { MeteoTableComponent } from "./pages/entities/meteo/meteo-table.component";
import { MeteoComponent } from "./pages/entities/meteo/meteo.component";
import { MilieuTableComponent } from "./pages/entities/milieu/milieu-table.component";
import { MilieuComponent } from "./pages/entities/milieu/milieu.component";
import { ObservateurTableComponent } from "./pages/entities/observateur/observateur-table.component";
import { ObservateurComponent } from "./pages/entities/observateur/observateur.component";
import { SexeTableComponent } from "./pages/entities/sexe/sexe-table.component";
import { SexeComponent } from "./pages/entities/sexe/sexe.component";
import { ViewComponent } from "./pages/vue/view.component";
import { BaseNaturalisteService } from "./services/base-naturaliste.service";

import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
  MatTreeModule,
  MatTreeNestedDataSource
} from "@angular/material";
import {
  MAT_MOMENT_DATE_FORMATS,
  MatMomentDateModule,
  MomentDateAdapter
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "../../node_modules/@angular/common/http";
import { ConfirmationDialogComponent } from "./components/dialog/confirmation-dialog.component";
import { TableTopbarComponent } from "./components/entities/table-topbar/table-topbar.component";
import { LcoEntiteSelectComponent } from "./components/form/entite-select/lco-entite-select.component";
import { LcoAutocompleteComponent } from "./components/form/lco-autocomplete/lco-autocomplete.component";
import { SearchByIdDialogComponent } from "./components/search-by-id-dialog/search-by-id-dialog.component";
import { fakeBackendProvider } from "./mock/fake-backend-interceptor";
import { ConfigurationFormComponent } from "./pages/configuration/configuration-form.component";
import { ConfigurationComponent } from "./pages/configuration/configuration.component";
import { ConfigurationService } from "./pages/configuration/configuration.service";
import { CreationModeHelper } from "./pages/creation/creation-mode.enum";
import { CreationService } from "./pages/creation/creation.service";
import { NavigationService } from "./pages/creation/navigation.service";
import { EntiteAvecLibelleEtCodeFormComponent } from "./pages/entities/entite-avec-libelle-et-code/entite-avec-libelle-et-code-form.component";
import { EntiteAvecLibelleFormComponent } from "./pages/entities/entite-avec-libelle/entite-avec-libelle-form.component";
import { EspeceFormComponent } from "./pages/entities/espece/espece-form.component";
import { EspeceTableComponent } from "./pages/entities/espece/espece-table.component";
import { EspeceComponent } from "./pages/entities/espece/espece.component";
import { LieuditFormComponent } from "./pages/entities/lieudit/lieudit-form.component";
import { LieuditTableComponent } from "./pages/entities/lieudit/lieudit-table.component";
import { LieuditComponent } from "./pages/entities/lieudit/lieudit.component";
import { ImportComponent } from "./pages/import/import.component";
import { ImportService } from "./pages/import/import.service";
import { SelectDialogComponent } from "./pages/vue/select-dialog/select-dialog.component";

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
  },
  {
    path: "configuration",
    component: ConfigurationComponent
  },
  {
    path: "import",
    component: ImportComponent
  }
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(baseNaturalisteRoutes),
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatTableModule,
    MatCheckboxModule,
    MatListModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatTreeModule
  ],
  exports: [
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatTableModule,
    MatCheckboxModule,
    MatDialogModule,
    MatListModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatTreeModule
  ],
  declarations: [
    AppComponent,
    AgeComponent,
    AgeTableComponent,
    ClasseComponent,
    ClasseTableComponent,
    ConfigurationComponent,
    ConfigurationFormComponent,
    CommuneComponent,
    CommuneTableComponent,
    CommuneFormComponent,
    ComportementComponent,
    ComportementTableComponent,
    ConfirmationDialogComponent,
    CreationComponent,
    DepartementComponent,
    DepartementTableComponent,
    DepartementFormComponent,
    EntiteAvecLibelleEtCodeFormComponent,
    EntiteAvecLibelleFormComponent,
    EntiteSimpleComponent,
    EntiteSimpleRemovalConfirmationComponent,
    EntiteSimpleDetailsComponent,
    EntiteSimpleFormComponent,
    EspeceComponent,
    EspeceTableComponent,
    EspeceFormComponent,
    EstimationNombreComponent,
    EstimationNombreTableComponent,
    EstimationNombreFormComponent,
    EstimationDistanceComponent,
    EstimationDistanceTableComponent,
    ImportComponent,
    InputCodeLibelleComponent,
    LcoAutocompleteComponent,
    LcoEntiteSelectComponent,
    LieuditComponent,
    LieuditTableComponent,
    LieuditFormComponent,
    MeteoComponent,
    MeteoTableComponent,
    MilieuComponent,
    MilieuTableComponent,
    ObservateurComponent,
    ObservateurTableComponent,
    SearchByIdDialogComponent,
    SelectDialogComponent,
    SexeComponent,
    SexeTableComponent,
    TopButtonsComponent,
    TableButtonsComponent,
    TableTopbarComponent,
    LcoInputTextComponent,
    EntityMessagesComponent,
    ViewComponent
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmationDialogComponent,
    SearchByIdDialogComponent,
    SelectDialogComponent
  ],
  providers: [
    BaseNaturalisteService,
    ConfigurationService,
    CreationModeHelper,
    CreationService,
    DonneeService,
    EntiteSimpleService,
    fakeBackendProvider,
    GestionModeHelper,
    InventaireService,
    ImportService,
    NavigationService,
    { provide: MAT_DATE_LOCALE, useValue: "fr-FR" },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class AppModule {}
