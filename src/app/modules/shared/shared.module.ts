import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MAT_MOMENT_DATE_FORMATS,
  MatMomentDateModule,
  MomentDateAdapter
} from "@angular/material-moment-adapter";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogModule
} from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTreeModule } from "@angular/material/tree";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { InputAgeComponent } from "../donnee-creation/components/input-age/input-age.component";
import { InputDistanceComponent } from "../donnee-creation/components/input-distance/input-distance.component";
import { InputEspeceComponent } from "../donnee-creation/components/input-espece/input-espece.component";
import { InputLieuditComponent } from "../donnee-creation/components/input-lieudit/input-lieudit.component";
import { InputNombreComponent } from "../donnee-creation/components/input-nombre/input-nombre.component";
import { InputObservateurComponent } from "../donnee-creation/components/input-observateur/input-observateur.component";
import { InputRegroupementComponent } from "../donnee-creation/components/input-regroupement/input-regroupement.component";
import { InputSexeComponent } from "../donnee-creation/components/input-sexe/input-sexe.component";
import { InputTemperatureComponent } from "../donnee-creation/components/input-temperature/input-temperature.component";
import { InputTimeComponent } from "../donnee-creation/components/input-time/input-time.component";
import { AutocompleteActiveSelection } from "./components/autocomplete/autocomplete-active-selection.directive";
import { AutocompleteComponent } from "./components/autocomplete/autocomplete.component";
import { ConfirmationDialogComponent } from "./components/confirmation-dialog/confirmation-dialog.component";
import { BnSelectComponent } from "./components/entite-select/bn-select.component";
import { AutocompleteComportementComponent } from "./components/form/autocomplete-comportement/autocomplete-comportement.component";
import { AutocompleteMeteoComponent } from "./components/form/autocomplete-meteo/autocomplete-meteo.component";
import { AutocompleteMilieuComponent } from "./components/form/autocomplete-milieu/autocomplete-milieu.component";
import { MultipleSelectComponent } from "./components/form/multiple-select/multiple-select.component";
import { MultipleOptionsDialogComponent } from "./components/multiple-options-dialog/multiple-options-dialog.component";
import { BackendApiService } from "./services/backend-api.service";

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
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
    MatMomentDateModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    ReactiveFormsModule
  ],
  declarations: [
    AutocompleteActiveSelection,
    AutocompleteComportementComponent,
    AutocompleteMeteoComponent,
    AutocompleteMilieuComponent,
    AutocompleteComponent,
    BnSelectComponent,
    ConfirmationDialogComponent,
    InputAgeComponent,
    InputDistanceComponent,
    InputEspeceComponent,
    InputLieuditComponent,
    InputNombreComponent,
    InputObservateurComponent,
    InputRegroupementComponent,
    InputSexeComponent,
    InputTemperatureComponent,
    InputTimeComponent,
    MultipleOptionsDialogComponent,
    MultipleSelectComponent
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    MultipleOptionsDialogComponent
  ],
  exports: [
    AutocompleteComponent,
    AutocompleteComportementComponent,
    AutocompleteMeteoComponent,
    AutocompleteMilieuComponent,
    BnSelectComponent,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    ConfirmationDialogComponent,
    FormsModule,
    HttpClientModule,
    InputAgeComponent,
    InputDistanceComponent,
    InputEspeceComponent,
    InputLieuditComponent,
    InputNombreComponent,
    InputObservateurComponent,
    InputRegroupementComponent,
    InputSexeComponent,
    InputTemperatureComponent,
    InputTimeComponent,
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
    MatMomentDateModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    MultipleOptionsDialogComponent,
    MultipleSelectComponent,
    ReactiveFormsModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "fr-FR" },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    BackendApiService
  ]
})
export class SharedModule {}
