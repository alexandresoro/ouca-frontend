import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "server-error",
  templateUrl: "./server-error.tpl.html"
})
export class ServerErrorComponent {
  public error: HttpErrorResponse;

  public constructor(private router: Router) {
    this.error = JSON.parse(
      this.router.getCurrentNavigation().extras.state.error
    );
  }
}
