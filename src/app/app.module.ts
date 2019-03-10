import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { LcoInputTextComponent } from "./components/form/input-text/lco-input-text.component";
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
import { RouterModule, Routes } from "@angular/router";
import { SearchByIdDialogComponent } from "./components/search-by-id-dialog/search-by-id-dialog.component";
import { fakeBackendProvider } from "./mock/fake-backend-interceptor";
import { ApplicationManagementModule } from "./modules/application-management/application-management.module";
import { DonneeCreationModule } from "./modules/donnee-creation/donnee-creation.module";
import { DonneeViewModule } from "./modules/donnee-view/donnee-view.module";
import { ModelManagementModule } from "./modules/model-management/model-management.module";
import { SharedModule } from "./modules/shared/shared.module";

const routes: Routes = [];
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    SharedModule,
    ApplicationManagementModule,
    DonneeCreationModule,
    DonneeViewModule,
    ModelManagementModule
  ],
  exports: [],
  declarations: [
    AppComponent,
    SearchByIdDialogComponent,
    LcoInputTextComponent
  ],
  bootstrap: [AppComponent],
  entryComponents: [SearchByIdDialogComponent],
  providers: [
    BaseNaturalisteService,
    fakeBackendProvider,
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
