import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { EntityMessagesComponent } from "./components/entities/messages/messages.component";
import { TableButtonsComponent } from "./components/entities/table-buttons/table-buttons.component";
import { TopButtonsComponent } from "./components/entities/top-buttons/top-buttons.component";
import { LcoInputTextComponent } from "./components/form/input-text/lco-input-text.component";
import { CreationComponent } from "./pages/creation/creation.component";
import { DonneeService } from "./pages/creation/donnee.service";
import { InventaireService } from "./pages/creation/inventaire.service";
import { BaseNaturalisteService } from "./services/base-naturaliste.service";

import { MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material";
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material/core";
import { ConfirmationDialogComponent } from "./components/dialog/confirmation-dialog.component";
import { TableTopbarComponent } from "./components/entities/table-topbar/table-topbar.component";
import { LcoAutocompleteComponent } from "./components/form/lco-autocomplete/lco-autocomplete.component";
import { SearchByIdDialogComponent } from "./components/search-by-id-dialog/search-by-id-dialog.component";
import { fakeBackendProvider } from "./mock/fake-backend-interceptor";
import { ApplicationManagementModule } from "./modules/application-management/application-management.module";
import { DonneeViewModule } from "./modules/donnee-view/donnee-view.module";
import { ModelManagementModule } from "./modules/model-management/model-management.module";
import { SharedModule } from "./modules/shared/shared.module";
import { CreationModeHelper } from "./pages/creation/creation-mode.enum";
import { CreationService } from "./pages/creation/creation.service";
import { InputAgeComponent } from "./pages/creation/input-age/input-age.component";
import { InputCommentaireComponent } from "./pages/creation/input-commentaire/input-commentaire.component";
import { InputComportementsComponent } from "./pages/creation/input-comportements/input-comportements.component";
import { InputDateComponent } from "./pages/creation/input-date/input-date.component";
import { InputDistanceComponent } from "./pages/creation/input-distance/input-distance.component";
import { InputEspeceComponent } from "./pages/creation/input-espece/input-espece.component";
import { InputLieuditComponent } from "./pages/creation/input-lieudit/input-lieudit.component";
import { InputMeteosComponent } from "./pages/creation/input-meteos/input-metos.component";
import { InputMilieuxComponent } from "./pages/creation/input-milieux/input-milieux.component";
import { InputNombreComponent } from "./pages/creation/input-nombre/input-nombre.component";
import { InputObservateurComponent } from "./pages/creation/input-observateur/input-observateur.component";
import { InputObservateursAssociesComponent } from "./pages/creation/input-observateurs-associes/input-observateurs-associes.component";
import { InputRegroupementComponent } from "./pages/creation/input-regroupement/input-regroupement.component";
import { InputSexeComponent } from "./pages/creation/input-sexe/input-sexe.component";
import { InputTemperatureComponent } from "./pages/creation/input-temperature/input-temperature.component";
import { InputTimeComponent } from "./pages/creation/input-time/input-time.component";
import { NavigationService } from "./pages/creation/navigation.service";

const baseNaturalisteRoutes: Routes = [
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
  imports: [
    RouterModule.forRoot(baseNaturalisteRoutes),
    SharedModule,
    ApplicationManagementModule,
    DonneeViewModule,
    ModelManagementModule
  ],
  exports: [],
  declarations: [
    AppComponent,
    ConfirmationDialogComponent,
    CreationComponent,
    InputAgeComponent,
    InputCommentaireComponent,
    InputDateComponent,
    InputDistanceComponent,
    InputComportementsComponent,
    InputEspeceComponent,
    InputLieuditComponent,
    InputTimeComponent,
    InputMeteosComponent,
    InputMilieuxComponent,
    InputNombreComponent,
    InputObservateurComponent,
    InputObservateursAssociesComponent,
    InputRegroupementComponent,
    InputTemperatureComponent,
    InputSexeComponent,
    LcoAutocompleteComponent,
    SearchByIdDialogComponent,
    TopButtonsComponent,
    TableButtonsComponent,
    TableTopbarComponent,
    LcoInputTextComponent,
    EntityMessagesComponent
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmationDialogComponent, SearchByIdDialogComponent],
  providers: [
    BaseNaturalisteService,
    CreationModeHelper,
    CreationService,
    DonneeService,
    fakeBackendProvider,
    InventaireService,
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
