import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
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
  MatTreeModule
} from "@angular/material";
import {
  MAT_MOMENT_DATE_FORMATS,
  MatMomentDateModule,
  MomentDateAdapter
} from "@angular/material-moment-adapter";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AutocompleteComponent } from "./components/autocomplete/autocomplete.component";
import { ConfirmationDialogComponent } from "./components/confirmation-dialog/confirmation-dialog.component";
import { BnSelectComponent } from "./components/entite-select/bn-select.component";
import { MultipleOptionsDialogComponent } from "./components/multiple-options-dialog/multiple-options-dialog.component";
import { BackendApiService } from "./services/backend-api.service";

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
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
  declarations: [
    ConfirmationDialogComponent,
    AutocompleteComponent,
    BnSelectComponent,
    MultipleOptionsDialogComponent
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    MultipleOptionsDialogComponent
  ],
  exports: [
    ConfirmationDialogComponent,
    CommonModule,
    BrowserModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AutocompleteComponent,
    BnSelectComponent,
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
    MatTreeModule,
    MultipleOptionsDialogComponent
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
