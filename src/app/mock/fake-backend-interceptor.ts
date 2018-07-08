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

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log("Intercepted request...");

    return of(null)
      .pipe(
        mergeMap(() => {
          if (
            request.url.endsWith("/creation/init") &&
            request.method === "GET"
          ) {
            if (
              request.headers.get("Authorization") === "Bearer fake-jwt-token"
            ) {
              return of(new HttpResponse({ status: 200, body: [] }));
            } else {
              // return 401 not authorised if token is null or invalid
              return throwError({ error: { message: "Unauthorised" } });
            }
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
