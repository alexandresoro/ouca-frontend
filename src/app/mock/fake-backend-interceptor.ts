import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { delay, dematerialize, materialize, mergeMap } from "rxjs/operators";
import { Injectable } from "../../../node_modules/@angular/core";
import * as configurationPageMock from "./configuration-page/configuration.json";
import * as creationPageCreateDonneeMock from "./creation-page/creation-page-create-donnee.json";
import * as creationPageCreateInventaireMock from "./creation-page/creation-page-create-inventaire.json";
import * as creationPageInitMock from "./creation-page/creation-page-init.json";
import * as agesMock from "./gestion-base-pages/ages.json";
import * as classesMock from "./gestion-base-pages/classes.json";
import * as communesMock from "./gestion-base-pages/communes.json";
import * as comportementsMock from "./gestion-base-pages/comportements.json";
import * as departementsMock from "./gestion-base-pages/departements.json";
import * as especesMock from "./gestion-base-pages/especes.json";
import * as estimationsDistanceMock from "./gestion-base-pages/estimations-distance.json";
import * as estimationsNombreMock from "./gestion-base-pages/estimations-nombre.json";
import * as lieuxditsMock from "./gestion-base-pages/lieuxdits.json";
import * as meteosMock from "./gestion-base-pages/meteos.json";
import * as milieuxMock from "./gestion-base-pages/milieux.json";
import * as observateursMock from "./gestion-base-pages/observateurs.json";
import * as sexesMock from "./gestion-base-pages/sexes.json";

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log("Intercepted request: ", request.url);

    return of(null)
      .pipe(
        mergeMap(() => {
          if (
            request.url.endsWith("/creation/init") &&
            request.method === "GET"
          ) {
            return of(
              new HttpResponse({ status: 200, body: creationPageInitMock })
            );
          } else if (
            request.url.endsWith("/creation/inventaire/create") &&
            request.method === "POST"
          ) {
            return of(
              new HttpResponse({
                status: 200,
                body: creationPageCreateInventaireMock
              })
            );
          } else if (
            request.url.endsWith("/creation/donnee/create") &&
            request.method === "POST"
          ) {
            return of(
              new HttpResponse({
                status: 200,
                body: creationPageCreateDonneeMock
              })
            );
          } else if (
            request.url.endsWith("/creation/donnee/delete/") &&
            request.method === "GET"
          ) {
            return of(new HttpResponse({ status: 200, body: {} }));
          } else if (
            request.url.endsWith("/creation/next_donnee/") &&
            request.method === "GET"
          ) {
            return of(new HttpResponse({ status: 200, body: {} }));
          } else if (
            request.url.endsWith("/creation/previous_donnee/") &&
            request.method === "GET"
          ) {
            return of(new HttpResponse({ status: 200, body: {} }));
          } else if (
            request.url.endsWith("/creation/next_regroupement") &&
            request.method === "GET"
          ) {
            return of(new HttpResponse({ status: 200, body: {} }));
          } else if (
            request.url.endsWith("/observateur/all") &&
            request.method === "GET"
          ) {
            return of(
              new HttpResponse({ status: 200, body: observateursMock })
            );
          } else if (
            request.url.endsWith("/departement/all") &&
            request.method === "GET"
          ) {
            return of(
              new HttpResponse({ status: 200, body: departementsMock })
            );
          } else if (
            request.url.endsWith("/commune/all") &&
            request.method === "GET"
          ) {
            return of(new HttpResponse({ status: 200, body: communesMock }));
          } else if (
            request.url.endsWith("/lieudit/all") &&
            request.method === "GET"
          ) {
            return of(new HttpResponse({ status: 200, body: lieuxditsMock }));
          } else if (
            request.url.endsWith("/meteo/all") &&
            request.method === "GET"
          ) {
            return of(new HttpResponse({ status: 200, body: meteosMock }));
          } else if (
            request.url.endsWith("/classe/all") &&
            request.method === "GET"
          ) {
            return of(new HttpResponse({ status: 200, body: classesMock }));
          } else if (
            request.url.endsWith("/espece/all") &&
            request.method === "GET"
          ) {
            return of(new HttpResponse({ status: 200, body: especesMock }));
          } else if (
            request.url.endsWith("/sexe/all") &&
            request.method === "GET"
          ) {
            return of(new HttpResponse({ status: 200, body: sexesMock }));
          } else if (
            request.url.endsWith("/age/all") &&
            request.method === "GET"
          ) {
            return of(new HttpResponse({ status: 200, body: agesMock }));
          } else if (
            request.url.endsWith("/estimation-nombre/all") &&
            request.method === "GET"
          ) {
            return of(
              new HttpResponse({ status: 200, body: estimationsNombreMock })
            );
          } else if (
            request.url.endsWith("/estimation-distance/all") &&
            request.method === "GET"
          ) {
            return of(
              new HttpResponse({ status: 200, body: estimationsDistanceMock })
            );
          } else if (
            request.url.endsWith("/milieu/all") &&
            request.method === "GET"
          ) {
            return of(new HttpResponse({ status: 200, body: milieuxMock }));
          } else if (
            request.url.endsWith("/comportement/all") &&
            request.method === "GET"
          ) {
            return of(
              new HttpResponse({ status: 200, body: comportementsMock })
            );
          } else if (
            request.url.endsWith("/configuration/init") &&
            request.method === "GET"
          ) {
            return of(
              new HttpResponse({ status: 200, body: configurationPageMock })
            );
          }

          // pass through any requests not handled above
          return next.handle(request);
        })
      )
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
