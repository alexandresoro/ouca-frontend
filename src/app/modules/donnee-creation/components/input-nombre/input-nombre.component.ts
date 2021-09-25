import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Apollo, gql } from "apollo-angular";
import { combineLatest, Observable, of } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { EstimationNombre } from "src/app/model/graphql";
import { CreationModeService } from "src/app/services/creation-mode.service";
import { AutocompleteAttribute } from "../../../shared/components/autocomplete/autocomplete-attribute.object";

type InputNombreQueryResult = {
  estimationsNombre: EstimationNombre[],
}

const INPUT_NOMBRE_QUERY = gql`
  query {
    estimationsNombre {
      id
      libelle
      nonCompte
    }
  }
`;

@Component({
  selector: "input-nombre",
  templateUrl: "./input-nombre.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputNombreComponent {
  @Input() public controlGroup: FormGroup;

  @Input() public defaultNombre: number;

  @Input() public isMultipleSelectMode?: boolean;

  public estimationsNombre$: Observable<EstimationNombre[]>;

  constructor(
    private apollo: Apollo,
    private creationModeService: CreationModeService
  ) {
    this.estimationsNombre$ = this.apollo.watchQuery<InputNombreQueryResult>({
      query: INPUT_NOMBRE_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.estimationsNombre;
      })
    );
  }

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
