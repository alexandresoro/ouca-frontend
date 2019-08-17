import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Classe } from "basenaturaliste-model/classe.object";
import { Espece } from "basenaturaliste-model/espece.object";
import { combineLatest, Observable } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";
import { AutocompleteAttribute } from "../../../shared/components/autocomplete/autocomplete-attribute.object";

@Component({
  selector: "input-espece",
  templateUrl: "./input-espece.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputEspeceComponent implements OnInit {
  @Input() public controlGroup: FormGroup;

  @Input() public classes: Observable<Classe[]>;

  @Input() public especes: Observable<Espece[]>;

  @Input() public isMultipleSelectMode?: boolean;

  public filteredEspeces$: Observable<Espece[]>;

  public classeAutocompleteAttributes: AutocompleteAttribute[] = [
    {
      key: "libelle",
      exactSearchMode: false,
      startWithMode: true
    }
  ];

  public especeAutocompleteAttributes: AutocompleteAttribute[] = [
    {
      key: "code",
      exactSearchMode: true,
      startWithMode: true,
      weight: 10
    },
    {
      key: "nomFrancais",
      exactSearchMode: false,
      startWithMode: false,
      weight: 1
    },
    {
      key: "nomLatin",
      exactSearchMode: false,
      startWithMode: false,
      weight: 1
    }
  ];

  public ngOnInit(): void {
    const classeControl = this.controlGroup.get("classe");

    classeControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((selectedClasse: Classe) => {
        this.resetSelectedEspece();
      });

    this.filteredEspeces$ = combineLatest(
      classeControl.valueChanges as Observable<Classe>,
      this.especes,
      (selectedClasse, especes) => {
        if (especes) {
          if (!!selectedClasse && !!selectedClasse.id) {
            return especes.filter((espece) => {
              return (
                espece.classeId === selectedClasse.id ||
                (espece.classe && espece.classe.id === selectedClasse.id)
              );
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
    if (
      this.controlGroup.controls.espece &&
      !!this.controlGroup.controls.espece.value
    ) {
      this.controlGroup.controls.espece.setValue(null);
    } else if (
      this.controlGroup.controls.especes &&
      !!this.controlGroup.controls.especes.value
    ) {
      this.controlGroup.controls.especes.setValue(null);
    }
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
