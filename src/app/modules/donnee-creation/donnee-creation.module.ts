import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { InputAgeComponent } from "./components/input-age/input-age.component";
import { InputCommentaireComponent } from "./components/input-commentaire/input-commentaire.component";
import { InputComportementsComponent } from "./components/input-comportements/input-comportements.component";
import { InputDateComponent } from "./components/input-date/input-date.component";
import { InputDistanceComponent } from "./components/input-distance/input-distance.component";
import { InputMeteosComponent } from "./components/input-meteos/input-metos.component";
import { InputMilieuxComponent } from "./components/input-milieux/input-milieux.component";
import { InputNombreComponent } from "./components/input-nombre/input-nombre.component";
import { InputObservateurComponent } from "./components/input-observateur/input-observateur.component";
import { InputObservateursAssociesComponent } from "./components/input-observateurs-associes/input-observateurs-associes.component";
import { InputRegroupementComponent } from "./components/input-regroupement/input-regroupement.component";
import { InputSexeComponent } from "./components/input-sexe/input-sexe.component";
import { InputTemperatureComponent } from "./components/input-temperature/input-temperature.component";
import { InputTimeComponent } from "./components/input-time/input-time.component";
import { SearchByIdDialogComponent } from "./components/search-by-id-dialog/search-by-id-dialog.component";
import { DonneeCreationRoutingModule } from "./donnee-creation-routing.module";
import { CreationComponent } from "./pages/creation/creation.component";
import { NavigationService } from "./services/navigation.service";

@NgModule({
  imports: [SharedModule, DonneeCreationRoutingModule],
  declarations: [
    CreationComponent,
    InputAgeComponent,
    InputCommentaireComponent,
    InputComportementsComponent,
    InputDateComponent,
    InputDistanceComponent,
    InputMeteosComponent,
    InputMilieuxComponent,
    InputNombreComponent,
    InputObservateurComponent,
    InputObservateursAssociesComponent,
    InputRegroupementComponent,
    InputSexeComponent,
    InputTemperatureComponent,
    InputTimeComponent,
    SearchByIdDialogComponent
  ],
  entryComponents: [SearchByIdDialogComponent],
  exports: [],
  providers: [NavigationService]
})
export class DonneeCreationModule {}
