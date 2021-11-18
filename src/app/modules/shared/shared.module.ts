import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTreeModule } from "@angular/material/tree";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { DateFnsDateAdapter, MAT_DATE_FNS_DATE_FORMATS } from "src/app/date-adapter/date-fns-adapter";
import { InputAgeComponent } from "../donnee-creation/components/input-age/input-age.component";
import { InputDistanceComponent } from "../donnee-creation/components/input-distance/input-distance.component";
import { InputDurationComponent } from '../donnee-creation/components/input-duration/input-duration.component';
import { InputEspeceComponent } from "../donnee-creation/components/input-espece/input-espece.component";
import { InputLieuditComponent } from "../donnee-creation/components/input-lieudit/input-lieudit.component";
import { InputNombreComponent } from "../donnee-creation/components/input-nombre/input-nombre.component";
import { InputObservateurComponent } from "../donnee-creation/components/input-observateur/input-observateur.component";
import { InputRegroupementComponent } from "../donnee-creation/components/input-regroupement/input-regroupement.component";
import { InputSexeComponent } from "../donnee-creation/components/input-sexe/input-sexe.component";
import { InputTemperatureComponent } from "../donnee-creation/components/input-temperature/input-temperature.component";
import { InputTimeComponent } from "../donnee-creation/components/input-time/input-time.component";
import { AutocompleteComponent } from "./components/autocomplete/autocomplete.component";
import { ConfirmationDialogComponent } from "./components/confirmation-dialog/confirmation-dialog.component";
import { MultipleSelectComponent } from "./components/form/multiple-select/multiple-select.component";
import { MultipleOptionsDialogComponent } from "./components/multiple-options-dialog/multiple-options-dialog.component";
import { NetworkUnavailableDialogComponent } from "./components/network-unavailable-dialog/network-unavailable-dialog.component";
import { StatusMessageComponent } from "./components/status-message/status-message.component";

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    NgxChartsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AutocompleteComponent,
    ConfirmationDialogComponent,
    NetworkUnavailableDialogComponent,
    InputAgeComponent,
    InputDistanceComponent,
    InputDurationComponent,
    InputEspeceComponent,
    InputLieuditComponent,
    InputNombreComponent,
    InputObservateurComponent,
    InputRegroupementComponent,
    InputSexeComponent,
    InputTemperatureComponent,
    InputTimeComponent,
    MultipleOptionsDialogComponent,
    MultipleSelectComponent,
    StatusMessageComponent
  ],
  exports: [
    AutocompleteComponent,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    ConfirmationDialogComponent,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    InputAgeComponent,
    InputDistanceComponent,
    InputDurationComponent,
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
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    MultipleOptionsDialogComponent,
    MultipleSelectComponent,
    NetworkUnavailableDialogComponent,
    NgxChartsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "fr-FR" },
    {
      provide: DateAdapter,
      useClass: DateFnsDateAdapter
    },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    { provide: MAT_DATE_FORMATS, useValue: MAT_DATE_FNS_DATE_FORMATS }
  ]
})
export class SharedModule { }
