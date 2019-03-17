import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
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
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  entryComponents: [],
  providers: []
})
export class AppModule {}
