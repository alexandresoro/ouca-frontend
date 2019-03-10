import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { EstimationNombre } from "../../../../model/estimation-nombre.object";
import { AutocompleteAttribute } from "../../../shared/components/lco-autocomplete/autocomplete-attribute.object";

@Component({
  selector: "input-nombre",
  templateUrl: "./input-nombre.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputNombreComponent {
  @Input() public estimationsNombre: EstimationNombre[];

  @Input() public controlGroup: FormGroup;

  @Input() public defaultNombre: number;

  public autocompleteAttributes: AutocompleteAttribute[] = [
    {
      key: "libelle",
      exactSearchMode: false,
      startWithMode: false
    }
  ];

  public onEstimationNombreChanged(estimation: EstimationNombre) {
    if (!!estimation && !!estimation.nonCompte) {
      this.controlGroup.controls.nombre.disable();
      this.controlGroup.controls.nombre.setValue(null);
    } else {
      this.controlGroup.controls.nombre.enable();

      if (!!!this.controlGroup.controls.nombre.value) {
        // Set default value
        this.controlGroup.controls.nombre.setValue(this.defaultNombre);
      }
    }
  }

  private displayEstimationNombreFormat = (
    estimation: EstimationNombre
  ): string => {
    return !!estimation ? estimation.libelle : null;
  }
}
