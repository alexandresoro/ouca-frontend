import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { EstimationNombre } from "@ou-ca/ouca-model";
import { combineLatest, Observable, of } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { CreationModeService } from "src/app/services/creation-mode.service";
import { AutocompleteAttribute } from "../../../shared/components/autocomplete/autocomplete-attribute.object";

@Component({
  selector: "input-nombre",
  templateUrl: "./input-nombre.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputNombreComponent {
  @Input() public estimationsNombre: EstimationNombre[];

  @Input() public controlGroup: FormGroup;

  @Input() public defaultNombre: number;

  @Input() public isMultipleSelectMode?: boolean;

  constructor(private creationModeService: CreationModeService) { }

  public ngOnInit(): void {
    const estimationControl = this.isMultipleSelectMode
      ? this.controlGroup.get("estimationsNombre")
      : this.controlGroup.get("estimationNombre");

    const canNombreFieldBeActivated$: Observable<boolean> = this
      .isMultipleSelectMode
      ? of(true)
      : this.creationModeService.getStatus$().pipe(
        map((status) => {
          return status.isDonneeEnabled;
        })
      );

    combineLatest(
      estimationControl.valueChanges.pipe(distinctUntilChanged()),
      canNombreFieldBeActivated$
    ).subscribe(([selectedEstimation, canFieldBeActive]) => {
      if (canFieldBeActive) {
        this.onEstimationNombreChanged(selectedEstimation);
      } else {
        this.controlGroup.controls.nombre.disable();
      }
    });
  }

  public autocompleteAttributes: AutocompleteAttribute[] = [
    {
      key: "libelle",
      exactSearchMode: false,
      startWithMode: true
    }
  ];

  private onEstimationNombreChanged(estimation: EstimationNombre): void {
    if (estimation?.nonCompte) {
      this.controlGroup.controls.nombre.disable();
      this.controlGroup.controls.nombre.setValue(null);
    } else {
      this.controlGroup.controls.nombre.enable();

      if (!this.controlGroup.controls.nombre.value) {
        // Set default value
        this.controlGroup.controls.nombre.setValue(this.defaultNombre);
      }
    }
  }

  public displayEstimationNombreFormat = (
    estimation: EstimationNombre
  ): string => {
    return estimation ? estimation.libelle : null;
  };
}
