import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, retry } from "rxjs/operators";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(private router: Router) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retry(1),
      catchError((err, caught) => {
        if (err instanceof HttpErrorResponse && err?.url?.startsWith(window.location.origin)) { // Don't route on external URLs failures
          // In case of HTTP error, redirect to the error page
          const errorPageParams: NavigationExtras = {
            state: {
              error: JSON.stringify(err)
            },
            skipLocationChange: true
          };
          this.router.navigate(["/error"], errorPageParams);
        }
        return of(err);
      })
    );
  }
}
