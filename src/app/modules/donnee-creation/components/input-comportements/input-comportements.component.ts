import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { combineLatest, Observable, Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import { Comportement } from 'src/app/model/types/comportement.object';
import { AutocompleteAttribute } from "../../../shared/components/autocomplete/autocomplete-attribute.object";

@Component({
  selector: "input-comportements",
  templateUrl: "./input-comportements.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComportementsComponent implements OnInit, OnDestroy {
  @Input() public comportements: Comportement[];

  @Input() public donneeForm: FormGroup;

  @Input() public controlGroup: FormGroup;

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
        this.controlGroup.controls["comportement" + (indexComportement - 1)]
          .statusChanges as Observable<string>,
        this.controlGroup.controls["comportement" + (indexComportement - 1)]
          .valueChanges as Observable<Comportement>,
        (
          statusComportementInPreviousElt,
          selectedComportementInPreviousElt
        ) => {
          return {
            statusComportementInPreviousElt,
            selectedComportementInPreviousElt
          };
        }
      )
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(status => {
          if (
            !!status.selectedComportementInPreviousElt &&
            status.statusComportementInPreviousElt === "VALID"
          ) {
            this.controlGroup.controls["comportement" + indexComportement].enable(
              {
                onlySelf: true
              }
            );
          } else {
            this.controlGroup.controls[
              "comportement" + indexComportement
            ].disable({
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

  public displayComportementFormat = (comportement: Comportement): string => {
    return comportement
      ? comportement.code + " - " + comportement.libelle
      : null;
  };
}
