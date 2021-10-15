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
import { debounceTime, map, startWith, switchMap, takeUntil } from "rxjs/operators";
import { Classe, Espece, QueryClassesArgs, QueryEspecesArgs } from "src/app/model/graphql";
import autocompleteUpdaterObservable, { autocompleteWithParentHandler } from "src/app/modules/shared/helpers/autocomplete-updater-observable";
import { distinctUntilKeyChangedLoose } from 'src/app/modules/shared/rx-operators';

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
  query Especes($params: FindParams, $classeId: Int) {
    especes(params: $params, classeId: $classeId) {
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

  public matchingEspeces$: Observable<Espece[]>;

  constructor(private apollo: Apollo) {
  }

  public ngOnInit(): void {

    const classeControl = this.controlGroup.get("classe");
    const especeControl = this.controlGroup.get("espece");

    this.matchingClasses$ = autocompleteUpdaterObservable(classeControl, (value: string) => {
      return this.apollo.query<ClassesQueryResult, QueryClassesArgs>({
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

    this.controlGroup.controls.espece.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (selectedEspece: string | Espece) => {
          if ((selectedEspece as Espece)?.id) {
            this.controlGroup.controls.classe.setValue((selectedEspece as Espece).classe, {
              emitEvent: false
            });
          }
        }
      );

    this.matchingEspeces$ = combineLatest([
      classeControl.valueChanges.pipe(
        distinctUntilKeyChangedLoose("id"),
        startWith<Classe | string>(null as Classe),
      ),
      especeControl.valueChanges.pipe(
        debounceTime<Espece | string>(150) // We debounce here, as I don't have any proper solution to do it only for the case we need to, like the other cases
      )
    ]).pipe(
      takeUntil(this.destroy$),
      switchMap(([classeValue, especeValue]) => {

        return autocompleteWithParentHandler([classeValue, especeValue], (classeValue, especeValue) => {
          return this.apollo.query<EspecesQueryResult, QueryEspecesArgs>({
            query: INPUT_ESPECES_QUERY,
            variables: {
              params: {
                q: especeValue,
                max: 50
              },
              classeId: classeValue?.id ?? null
            }
          }).pipe(
            map(({ data }) => data?.especes)
          );
        });
      })
    );

    // When the classe changes, we reset the espece accordingly
    classeControl.valueChanges
      .pipe(
        distinctUntilKeyChangedLoose("id"),
        takeUntil(this.destroy$)
      )
      .subscribe((valueClasse) => {

        // No need to clear the espece if it belongs to the classe
        const isCurrentEspeceBelongingToCurrentClasse = (this.controlGroup.get("espece").value?.id === valueClasse?.id);

        // When the value of the classe changes, clear the selected espece
        // However, do not do that when the control itself is disabled
        // This can happen for example when 
        // wanting to edit back the inventaire after an espece has been set
        if (!classeControl.disabled && !isCurrentEspeceBelongingToCurrentClasse) {
          if (this.controlGroup?.controls?.espece?.value) {
            // When selecting a classe, filter the list of especes
            this.controlGroup.controls.espece.setValue(null);
          }
        }
      });

  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public displayClasseFormat = (classe: Classe): string => {
    return classe?.libelle ?? "";
  };

  public displayEspeceFormat = (espece: Espece): string => {
    return espece
      ? espece.code + " - " + espece.nomFrancais + " - " + espece.nomLatin
      : "";
  };
}
