import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Apollo, gql } from "apollo-angular";
import { combineLatest, Observable, Subject } from "rxjs";
import { map, takeUntil } from 'rxjs/operators';
import { Milieu, QueryMilieuxArgs } from "src/app/model/graphql";
import autocompleteUpdaterObservable from "src/app/modules/shared/helpers/autocomplete-updater-observable";

type MilieuxQueryResult = {
  milieux: Milieu[]
}

const INPUT_MILIEUX_QUERY = gql`
  query Milieux($params: FindParams) {
    milieux(params: $params) {
      id
      code
      libelle
    }
  }
`;

@Component({
  selector: "input-milieux",
  templateUrl: "./input-milieux.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputMilieuxComponent implements OnInit, OnDestroy {
  @Input() public donneeForm: FormGroup;

  @Input() public controlGroup: FormGroup;

  public matchingMilieuxPerInput$: Observable<Milieu[]>[] = [];

  private readonly destroy$ = new Subject();

  constructor(
    private apollo: Apollo,
  ) {
  }

  ngOnInit(): void {

    for (let indexMilieu = 0; indexMilieu < 4; indexMilieu++) {
      this.matchingMilieuxPerInput$[indexMilieu] = autocompleteUpdaterObservable(
        this.controlGroup.controls[`milieu${indexMilieu + 1}`],
        (value: string) => {
          return this.apollo.query<MilieuxQueryResult, QueryMilieuxArgs>({
            query: INPUT_MILIEUX_QUERY,
            variables: {
              params: {
                q: value
              }
            }
          }).pipe(
            map(({ data }) => data?.milieux)
          )
        });
    }

    // First milieu should be enabled if and only if the donnee form is enabled
    this.donneeForm.statusChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe((status: string) => {
      if (status !== "DISABLED") {
        this.controlGroup.controls.milieu1.enable({
          onlySelf: true
        });
      } else {
        this.controlGroup.controls.milieu1.disable({
          onlySelf: true
        });
      }
    });

    // Other milieux should be active only if the previous milieu is active and has a valid value
    for (let indexMilieu = 2; indexMilieu <= 4; indexMilieu++) {
      combineLatest(
        [
          this.controlGroup.controls[`milieu${indexMilieu - 1}`].statusChanges,
          this.controlGroup.controls[`milieu${indexMilieu - 1}`].valueChanges
        ] as [Observable<string>, Observable<Milieu>],
      )
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(([statusMilieuInPreviousElt, selectedMilieuInPreviousElt]) => {
          if (
            !!selectedMilieuInPreviousElt &&
            statusMilieuInPreviousElt !== "DISABLED"
          ) {
            this.controlGroup.controls[`milieu${indexMilieu}`].enable({
              onlySelf: true
            });
          } else {
            this.controlGroup.controls[`milieu${indexMilieu}`].disable({
              onlySelf: true
            });
          }
        });
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public displayMilieuFormat = (milieu: Milieu): string => {
    return milieu ? milieu.code + " - " + milieu.libelle : null;
  };
}
