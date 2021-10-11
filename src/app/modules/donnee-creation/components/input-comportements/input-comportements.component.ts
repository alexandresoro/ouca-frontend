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
import { Comportement, FindParams } from "src/app/model/graphql";
import autocompleteUpdaterObservable from "src/app/modules/shared/helpers/autocomplete-updater-observable";

type ComportementsQueryResult = {
  comportements: Omit<Comportement, 'nicheur'>[]
}

const INPUT_COMPORTEMENTS_QUERY = gql`
  query Comportements($params: FindParams) {
    comportements(params: $params) {
      id
      code
      libelle
    }
  }
`;

@Component({
  selector: "input-comportements",
  templateUrl: "./input-comportements.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComportementsComponent implements OnInit, OnDestroy {
  @Input() public donneeForm: FormGroup;

  @Input() public controlGroup: FormGroup;

  public matchingComportementsPerInput$: Observable<Comportement[]>[] = [];

  private readonly destroy$ = new Subject();

  constructor(
    private apollo: Apollo,
  ) {
  }

  ngOnInit(): void {

    for (let indexComportement = 0; indexComportement < 6; indexComportement++) {
      this.matchingComportementsPerInput$[indexComportement] = autocompleteUpdaterObservable(
        this.controlGroup.controls[`comportement${indexComportement + 1}`],
        (value: string) => {
          return this.apollo.query<ComportementsQueryResult, { params: FindParams }>({
            query: INPUT_COMPORTEMENTS_QUERY,
            variables: {
              params: {
                q: value
              }
            }
          }).pipe(
            map(({ data }) => data?.comportements)
          )
        });
    }

    // First comportement should be enabled if and only if the donnee form is enabled
    this.donneeForm.statusChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe((status: string) => {
      if (status !== "DISABLED") {
        this.controlGroup.controls.comportement1.enable({
          onlySelf: true
        });
      } else {
        this.controlGroup.controls.comportement1.disable({
          onlySelf: true
        });
      }
    });

    // Other comportements should be active only if the previous comportement is active and has a valid value
    for (
      let indexComportement = 2;
      indexComportement <= 6;
      indexComportement++
    ) {
      combineLatest(
        [
          this.controlGroup.controls[`comportement${indexComportement - 1}`].statusChanges,
          this.controlGroup.controls[`comportement${indexComportement - 1}`].valueChanges
        ] as [Observable<string>, Observable<Comportement>]
      )
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(([statusComportementInPreviousElt, selectedComportementInPreviousElt]) => {
          if (
            !!selectedComportementInPreviousElt &&
            statusComportementInPreviousElt !== "DISABLED"
          ) {
            this.controlGroup.controls[`comportement${indexComportement}`].enable(
              {
                onlySelf: true
              }
            );
          } else {
            this.controlGroup.controls[`comportement${indexComportement}`].disable(
              {
                onlySelf: true
              }
            );
          }
        });
    }
  }
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public displayComportementFormat = (comportement: Comportement): string => {
    return comportement
      ? comportement.code + " - " + comportement.libelle
      : null;
  };
}
