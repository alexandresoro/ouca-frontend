import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Milieu } from "ouca-common/milieu.object";
import { combineLatest, Observable } from "rxjs";
import { AutocompleteAttribute } from "../../../shared/components/autocomplete/autocomplete-attribute.object";

@Component({
  selector: "input-milieux",
  templateUrl: "./input-milieux.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputMilieuxComponent implements OnInit {
  @Input() public milieux: Milieu[];

  @Input() public donneeForm: FormGroup;

  @Input() public controlGroup: FormGroup;

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
    // First milieu should be enabled if and only if the donnee form is enabled
    this.donneeForm.statusChanges.subscribe((status: string) => {
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
        this.controlGroup.controls["milieu" + (indexMilieu - 1)]
          .statusChanges as Observable<string>,
        this.controlGroup.controls["milieu" + (indexMilieu - 1)]
          .valueChanges as Observable<Milieu>,
        (statusMilieuInPreviousElt, selectedMilieuInPreviousElt) => {
          return {
            statusMilieuInPreviousElt,
            selectedMilieuInPreviousElt
          };
        }
      ).subscribe(status => {
        if (
          !!status.selectedMilieuInPreviousElt &&
          status.statusMilieuInPreviousElt === "VALID"
        ) {
          this.controlGroup.controls["milieu" + indexMilieu].enable({
            onlySelf: true
          });
        } else {
          this.controlGroup.controls["milieu" + indexMilieu].disable({
            onlySelf: true
          });
        }
      });
    }
  }

  public displayMilieuFormat = (milieu: Milieu): string => {
    return milieu ? milieu.code + " - " + milieu.libelle : null;
  };
}
