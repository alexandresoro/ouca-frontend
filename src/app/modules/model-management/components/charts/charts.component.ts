import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable, Subject } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { AgeWithSpecimensCount, Espece, QuerySpecimenCountByAgeArgs, QuerySpecimenCountBySexeArgs, SexeWithSpecimensCount } from "src/app/model/graphql";

type ChartsQueryResult = {
  espece: Espece
  specimenCountByAge: AgeWithSpecimensCount[]
  specimenCountBySexe: SexeWithSpecimensCount[]
}

const CHARTS_QUERY = gql`
  query SpecimensPerEspeceQuery($especeId: Int!) {
    espece(id: $especeId) {
      id
      code
      nomFrancais
      nomLatin
      classe {
        id
        libelle
      }
    }
    specimenCountByAge(especeId: $especeId) {
      id
      libelle
      nbSpecimens
    }
    specimenCountBySexe(especeId: $especeId) {
      id
      libelle
      nbSpecimens
    }
  }
`;

@Component({
  selector: "charts",
  templateUrl: "./charts.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartsComponent implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject();

  public currentEspece$: Observable<Espece>;

  public specimensBySexe: { name: string; value: number }[];

  public specimensByAge: { name: string; value: number }[];

  colorScheme = {
    domain: [
      "#DFF650",
      "#D8A0FF",
      "#98E4FF",
      "#FFFF66",
      "#FFADD6",
      "#B0F9FF",
      "#E5C8FF",
      "#FFA2A2",
      "#A6FFD9",
      "#FFD0B0",
      "#98E4FF"
    ]
  };

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    const chartObservable$ = this.route.paramMap.pipe(
      map(paramMap => Number(paramMap.get("id"))),
      switchMap((especeId) => {
        return this.apollo.query<ChartsQueryResult, QuerySpecimenCountByAgeArgs | QuerySpecimenCountBySexeArgs>({
          query: CHARTS_QUERY,
          variables: {
            especeId
          },
          fetchPolicy: "network-only"
        });
      })
    );

    this.currentEspece$ = chartObservable$.pipe(
      map(({ data }) => {
        return data?.espece
      })
    )

    chartObservable$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(({ data }) => {
      this.specimensByAge = data?.specimenCountByAge?.map(ageResult => {
        return {
          name: ageResult?.libelle,
          value: ageResult?.nbSpecimens
        }
      });
      this.specimensBySexe = data?.specimenCountBySexe?.map(sexeResult => {
        return {
          name: sexeResult?.libelle,
          value: sexeResult?.nbSpecimens
        }
      });
    })
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSelect(item: unknown): void {
    console.log("Item clicked", JSON.parse(JSON.stringify(item)));
  }

  onActivate(item: unknown): void {
    console.log("Activate", JSON.parse(JSON.stringify(item)));
  }

  onDeactivate(item: unknown): void {
    console.log("Deactivate", JSON.parse(JSON.stringify(item)));
  }
}
