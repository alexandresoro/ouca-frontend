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
import { Comportement } from "src/app/model/graphql";
import { AutocompleteAttribute } from "../../../shared/components/autocomplete/autocomplete-attribute.object";

type InputComportementsQueryResult = {
  comportements: Comportement[],
}

const INPUT_COMPORTEMENTS_QUERY = gql`
  query {
    comportements {
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

  public comportements$: Observable<Comportement[]>;

  private readonly destroy$ = new Subject();

  constructor(
    private apollo: Apollo,
  ) {
    this.comportements$ = this.apollo.watchQuery<InputComportementsQueryResult>({
      query: INPUT_COMPORTEMENTS_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.comportements;
      })
    );
  }

  public autocompleteAttributes: AutocompleteAttribute[] = [
    {
      key: "code",
      exactSearchMode: true,
      startWithMode: true,
      weight: 1
    },
    {
      key: "libelle",
      exactSearchMode: false,
      startWithMode: false
    }
  ];

  ngOnInit(): void {
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
