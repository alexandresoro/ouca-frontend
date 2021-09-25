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
import { Milieu } from "src/app/model/graphql";
import { AutocompleteAttribute } from "../../../shared/components/autocomplete/autocomplete-attribute.object";

type InputMilieuxQueryResult = {
  milieux: Milieu[],
}

const INPUT_MILIEUX_QUERY = gql`
  query {
    milieux {
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

  public milieux$: Observable<Milieu[]>;

  private readonly destroy$ = new Subject();

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

  constructor(
    private apollo: Apollo,
  ) {
    this.milieux$ = this.apollo.watchQuery<InputMilieuxQueryResult>({
      query: INPUT_MILIEUX_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.milieux;
      })
    );
  }

  ngOnInit(): void {
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
