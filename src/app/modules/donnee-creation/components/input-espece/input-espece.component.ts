import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Apollo, gql } from "apollo-angular";
import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs";
import { map, takeUntil, withLatestFrom } from "rxjs/operators";
import { Classe, Espece, FindParams } from "src/app/model/graphql";
import autocompleteUpdaterObservable from "src/app/modules/shared/helpers/autocomplete-updater-observable";
import { distinctUntilKeyChangedLoose } from 'src/app/modules/shared/rx-operators';
import { AutocompleteAttribute } from "../../../shared/components/autocomplete/autocomplete-attribute.object";

type ClassesQueryResult = {
  classes: Classe[]
}

type EspecesQueryResult = {
  especes: Espece[]
}

const INPUT_CLASSES_QUERY = gql`
  query Classes($params: FindParams) {
    classes(params: $params) {
      id
      libelle
    }
  }
`;

const INPUT_ESPECES_QUERY = gql`
  query {
    especes {
      id
      code
      nomFrancais
      nomLatin
      classe {
        id
        libelle
      }
    }
  }
`;

@Component({
  selector: "input-espece",
  templateUrl: "./input-espece.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputEspeceComponent implements OnInit, OnDestroy {
  @Input() public controlGroup: FormGroup;

  private readonly destroy$ = new Subject();

  public matchingClasses$: Observable<Classe[]>;

  private especes$: Observable<Espece[]>;

  public filteredEspeces$: Observable<Espece[]> = new Observable<Espece[]>();

  private selectedClasse$: BehaviorSubject<Classe> = new BehaviorSubject<Classe>(null);

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

  constructor(private apollo: Apollo) {
    const queryResult$ = this.apollo.watchQuery<EspecesQueryResult>({
      query: INPUT_ESPECES_QUERY
    }).valueChanges;

    this.especes$ = queryResult$.pipe(
      map(({ data }) => {
        return data?.especes;
      })
    );
  }

  public ngOnInit(): void {

    const classeControl = this.controlGroup.get("classe");

    this.matchingClasses$ = autocompleteUpdaterObservable(classeControl, (value: string) => {
      return this.apollo.query<ClassesQueryResult, { params: FindParams }>({
        query: INPUT_CLASSES_QUERY,
        variables: {
          params: {
            q: value
          }
        }
      }).pipe(
        map(({ data }) => data?.classes)
      )
    });

    if (
      this.controlGroup.controls.espece &&
      this.controlGroup.controls.classe
    ) {
      this.controlGroup.controls.espece.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (selectedEspece) => {
            if (selectedEspece?.id) {
              this.controlGroup.controls.classe.setValue(selectedEspece.classe, {
                emitEvent: false
              });
            }
          }
        );
    }

    classeControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((newValue) => {
      // This is done because when we first reach this component, we may have no value changes triggered,
      // so we need to initialize it with null (see the BehaviorSubject above)
      this.selectedClasse$.next(newValue);
    });

    this.filteredEspeces$ = combineLatest(
      this.selectedClasse$,
      this.especes$,
      (selection, especes) => {
        if (especes) {
          if (selection) {
            if (selection.id) {
              return especes.filter((espece) => {
                return (
                  espece?.classe?.id === selection.id
                );
              });
            }
          } else {
            return especes;
          }
        } else {
          return [];
        }
      }
    ).pipe(takeUntil(this.destroy$));

    // When the classe changes, we reset the espece accordingly
    classeControl.valueChanges
      .pipe(
        distinctUntilKeyChangedLoose("id"),
        withLatestFrom(this.filteredEspeces$),
        takeUntil(this.destroy$)
      )
      .subscribe(([valueClasse, filteredEspeces]) => {

        // No need to clear the espece if it belongs to the classe
        const isCurrentEspeceBelongingToCurrentClasse = !!filteredEspeces?.find((espece) => {
          return espece?.classe?.id === valueClasse?.id;
        });

        // When the value of the classe changes, clear the selected espece
        // However, do not do that when the control itself is disabled
        // This can happen for example when 
        // wanting to edit back the inventaire after an espece has been set
        if (!classeControl.disabled && !isCurrentEspeceBelongingToCurrentClasse) {
          this.resetSelectedEspece();
        }
      });

  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * When selecting a classe, filter the list of especes
   */
  public resetSelectedEspece(): void {
    if (this.controlGroup?.controls?.espece?.value) {
      this.controlGroup.controls.espece.setValue(null);
    } else if (this.controlGroup?.controls?.especes?.value) {
      this.controlGroup.controls.especes.setValue(null);
    }
  }

  public displayClasseFormat = (classe: Classe): string => {
    return classe ? classe.libelle : "";
  };

  public displayEspeceFormat = (espece: Espece): string => {
    return espece
      ? espece.code + " - " + espece.nomFrancais + " - " + espece.nomLatin
      : "";
  };
}
