import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import {
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
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LcoEntiteSelectComponent } from "../../components/form/entite-select/lco-entite-select.component";
import { LcoAutocompleteComponent } from "../../components/form/lco-autocomplete/lco-autocomplete.component";

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
  declarations: [LcoAutocompleteComponent, LcoEntiteSelectComponent],
  exports: [
    CommonModule,
    BrowserModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    LcoAutocompleteComponent,
    LcoEntiteSelectComponent,
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
  providers: []
})
export class SharedModule {}
