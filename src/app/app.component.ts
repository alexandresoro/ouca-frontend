import { Component } from "@angular/core";
import { AppConfigurationService } from "./services/app-configuration.service";
import { CreationPageModelService } from "./services/creation-page-model.service";

@Component({
  selector: "base-naturaliste",
  styleUrls: ["./app.component.scss"],
  templateUrl: "./app.tpl.html"
})
export class AppComponent {
  constructor(
    private appConfigurationService: AppConfigurationService,
    private creationPageModelService: CreationPageModelService
  ) {}

  ngOnInit(): void {
    this.appConfigurationService.refreshConfiguration();
    this.creationPageModelService.refreshPageModel();
  }
}
