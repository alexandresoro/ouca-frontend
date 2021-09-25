import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { ApplicationManagementModule } from "./modules/application-management/application-management.module";
import { DonneeCreationModule } from "./modules/donnee-creation/donnee-creation.module";
import { DonneeViewModule } from "./modules/donnee-view/donnee-view.module";
import { ModelManagementModule } from "./modules/model-management/model-management.module";
import { NotFoundComponent } from "./modules/shared/components/not-found/not-found.component";
import { ServerErrorComponent } from "./modules/shared/components/server-error/server-error.component";
import { HttpRequestInterceptor } from "./modules/shared/services/http-request-interceptor";
import { SharedModule } from "./modules/shared/shared.module";
import { GraphQLModule } from './graphql.module';

const routes: Routes = [
  { path: "error", component: ServerErrorComponent },
  { path: "**", component: NotFoundComponent }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    SharedModule,
    ApplicationManagementModule,
    DonneeCreationModule,
    DonneeViewModule,
    ModelManagementModule,
    FlexLayoutModule,
    GraphQLModule,
    HttpClientModule
  ],
  exports: [],
  declarations: [AppComponent, NotFoundComponent, ServerErrorComponent],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true
    }
  ]
})
export class AppModule { }
