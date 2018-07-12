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
import * as communesMock from "./communes.json";
import * as departementsMock from "./departements.json";
import * as lieuxditsMock from "./lieuxdits.json";
import * as observateursMock from "./observateurs.json";

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
            return of(new HttpResponse({ status: 200, body: {} }));
          }

          if (
            request.url.endsWith("/observateur/all") &&
            request.method === "GET"
          ) {
            return of(
              new HttpResponse({ status: 200, body: observateursMock })
            );
          }

          if (
            request.url.endsWith("/departement/all") &&
            request.method === "GET"
          ) {
            return of(
              new HttpResponse({ status: 200, body: departementsMock })
            );
          }

          if (
            request.url.endsWith("/commune/all") &&
            request.method === "GET"
          ) {
            return of(new HttpResponse({ status: 200, body: communesMock }));
          }

          if (
            request.url.endsWith("/lieudit/all") &&
            request.method === "GET"
          ) {
            return of(new HttpResponse({ status: 200, body: lieuxditsMock }));
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
