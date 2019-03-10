import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { combineLatest, Observable } from "rxjs";
import { Classe } from "../../../../model/classe.object";
import { Espece } from "../../../../model/espece.object";
import { AutocompleteAttribute } from "../../../shared/components/lco-autocomplete/autocomplete-attribute.object";

@Component({
  selector: "input-espece",
  templateUrl: "./input-espece.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputEspeceComponent implements OnInit {
  @Input() public controlGroup: FormGroup;

  @Input() public classes: Observable<Classe[]>;

  @Input() public especes: Observable<Espece[]>;

  public filteredEspeces$: Observable<Espece[]>;

  public classeAutocompleteAttributes: AutocompleteAttribute[] = [
    {
      key: "libelle",
      exactSearchMode: false,
      startWithMode: false
    }
  ];
  public especeAutocompleteAttributes: AutocompleteAttribute[] = [
    {
      key: "code",
      exactSearchMode: true,
      startWithMode: true
    },
    {
      key: "nomFrancais",
      exactSearchMode: false,
      startWithMode: false
    },
    {
      key: "nomLatin",
      exactSearchMode: false,
      startWithMode: false
    }
  ];

  public ngOnInit(): void {
    const classeControl = this.controlGroup.get("classe");

    classeControl.valueChanges.subscribe((selectedClasse: Classe) => {
      this.resetSelectedEspece();
    });

    this.filteredEspeces$ = combineLatest(
      classeControl.valueChanges as Observable<Classe>,
      this.especes,
      (selectedClasse, especes) => {
        if (especes) {
          if (!!selectedClasse && !!selectedClasse.id) {
            return especes.filter((espece) => {
              return espece.classeId === selectedClasse.id;
            });
          } else {
            return especes;
          }
        } else {
          return [];
        }
      }
    );
  }

  /**
   * When selecting a classe, filter the list of especes
   */
  public resetSelectedEspece(): void {
    this.controlGroup.controls.espece.setValue(null);
  }

  public displayClasseFormat = (classe: Classe): string => {
    return !!classe ? classe.libelle : "";
  }

  public displayEspeceFormat = (espece: Espece): string => {
    return !!espece
      ? espece.code + " - " + espece.nomFrancais + " - " + espece.nomLatin
      : "";
  }
}
