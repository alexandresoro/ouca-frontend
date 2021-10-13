import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Apollo, gql } from "apollo-angular";
import { combineLatest, Observable, Subject } from "rxjs";
import { distinctUntilChanged, map, takeUntil, withLatestFrom } from "rxjs/operators";
import { EstimationNombre, QueryEstimationsNombreArgs, Settings } from "src/app/model/graphql";
import autocompleteUpdaterObservable from "src/app/modules/shared/helpers/autocomplete-updater-observable";
import { CreationModeService } from "src/app/services/creation-mode.service";
import { AutocompleteAttribute } from "../../../shared/components/autocomplete/autocomplete-attribute.object";

type NombreQueryResult = {
  estimationsNombre: EstimationNombre[],
}

const INPUT_NOMBRE_QUERY = gql`
  query EstimationsNombre($params: FindParams) {
    estimationsNombre(params: $params) {
      id
      libelle
      nonCompte
    }
  }
`;

type DefaultNombreQueryResult = {
  settings: Pick<Settings, 'defaultNombre'>,
}

const INPUT_DEFAULT_NOMBRE_QUERY = gql`
query DefaultNombreQuery {
  settings {
    id
    defaultNombre
  }
}
`;

@Component({
  selector: "input-nombre",
  templateUrl: "./input-nombre.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputNombreComponent implements OnInit, OnDestroy {
  @Input() public controlGroup: FormGroup;

  private readonly destroy$ = new Subject();

  public matchingEstimationsNombre$: Observable<EstimationNombre[]>;

  private defaultNombre$: Observable<number>;

  constructor(
    private apollo: Apollo,
    private creationModeService: CreationModeService
  ) {
  }

  public ngOnInit(): void {

    this.defaultNombre$ = this.apollo.watchQuery<DefaultNombreQueryResult>({
      query: INPUT_DEFAULT_NOMBRE_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.settings?.defaultNombre;
      })
    );

    const estimationControl = this.controlGroup.get("estimationNombre");

    this.matchingEstimationsNombre$ = autocompleteUpdaterObservable(estimationControl, (value: string) => {
      return this.apollo.query<NombreQueryResult, QueryEstimationsNombreArgs>({
        query: INPUT_NOMBRE_QUERY,
        variables: {
          params: {
            q: value
          }
        }
      }).pipe(
        map(({ data }) => data?.estimationsNombre)
      )
    });

    const canNombreFieldBeActivated$: Observable<boolean> = this.creationModeService.getStatus$().pipe(
      map((status) => {
        return status.isDonneeEnabled;
      })
    );

    combineLatest(
      estimationControl.valueChanges.pipe(distinctUntilChanged()),
      canNombreFieldBeActivated$
    ).pipe(
      takeUntil(this.destroy$),
      withLatestFrom(this.defaultNombre$)
    )
      .subscribe(([[selectedEstimation, canFieldBeActive], defaultNombre]) => {
        if (canFieldBeActive) {
          this.onEstimationNombreChanged(selectedEstimation, defaultNombre);
        } else {
          this.controlGroup.controls.nombre.disable();
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public autocompleteAttributes: AutocompleteAttribute[] = [
    {
      key: "libelle",
      exactSearchMode: false,
      startWithMode: true
    }
  ];

  private onEstimationNombreChanged(estimation: EstimationNombre, defaultNombre: number): void {
    if (estimation?.nonCompte) {
      this.controlGroup.controls.nombre.disable();
      this.controlGroup.controls.nombre.setValue(null);
    } else {
      this.controlGroup.controls.nombre.enable();

      if (!this.controlGroup.controls.nombre.value) {
        // Set default value
        this.controlGroup.controls.nombre.setValue(defaultNombre);
      }
    }
  }

  public displayEstimationNombreFormat = (
    estimation: EstimationNombre
  ): string => {
    return estimation?.libelle ?? null;
  };
}
