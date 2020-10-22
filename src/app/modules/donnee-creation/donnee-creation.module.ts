import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { InputCommentaireComponent } from "./components/input-commentaire/input-commentaire.component";
import { InputComportementsComponent } from "./components/input-comportements/input-comportements.component";
import { InputDateComponent } from "./components/input-date/input-date.component";
import { InputMeteosComponent } from "./components/input-meteos/input-metos.component";
import { InputMilieuxComponent } from "./components/input-milieux/input-milieux.component";
import { InputObservateursAssociesComponent } from "./components/input-observateurs-associes/input-observateurs-associes.component";
import { SearchByIdDialogComponent } from "./components/search-by-id-dialog/search-by-id-dialog.component";
import { DonneeCreationRoutingModule } from "./donnee-creation-routing.module";
import { CreationComponent } from "./pages/creation/creation.component";

@NgModule({
  imports: [SharedModule, DonneeCreationRoutingModule],
  declarations: [
    CreationComponent,
    InputCommentaireComponent,
    InputComportementsComponent,
    InputDateComponent,
    InputMeteosComponent,
    InputMilieuxComponent,
    InputObservateursAssociesComponent,
    SearchByIdDialogComponent
  ],
  exports: [],
  providers: []
})
export class DonneeCreationModule { }
