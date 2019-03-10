import {
  GestionMode,
  GestionModeHelper
} from "../modules/model-management/pages/gestion-mode.enum";
import { PageComponent } from "../modules/shared/components/page.component";

export class EntiteComponent extends PageComponent {
  public mode: GestionMode;

  constructor(private modeHelper: GestionModeHelper) {
    super();
  }

  public isEditionMode(): boolean {
    return this.modeHelper.isEditionMode(this.mode);
  }

  public isCreationMode(): boolean {
    return this.modeHelper.isCreationMode(this.mode);
  }

  public isViewAllMode(): boolean {
    return this.modeHelper.isViewAllMode(this.mode);
  }

  public isViewOneMode(): boolean {
    return this.modeHelper.isViewOneMode(this.mode);
  }

  public isRemoveMode(): boolean {
    return this.modeHelper.isRemoveMode(this.mode);
  }
}
