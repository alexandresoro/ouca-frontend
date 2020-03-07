import { Component } from "@angular/core";
import { CoordinatesService } from "./services/coordinates.service";

@Component({
  selector: "base-naturaliste",
  styleUrls: ["./app.component.scss"],
  templateUrl: "./app.tpl.html"
})
export class AppComponent {
  constructor(private coordinatesService: CoordinatesService) {}

  ngOnInit(): void {
    this.coordinatesService.initAppCoordinatesSystem();
  }
}
