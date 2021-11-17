import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import { BehaviorSubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { QueryExportDonneesArgs, SearchDonneeCriteria } from "src/app/model/graphql";
import { DOWNLOAD_PATH, EXCEL_FILE_EXTENSION } from "src/app/modules/shared/helpers/utils";
import { downloadFile } from "../../../shared/helpers/file-downloader.helper";
import { SearchCriteriaService } from "../../services/search-criteria.service";

type ExportDonneesResult = {
  exportDonnees: string | null
}

const EXPORT_DONNEES = gql`
  query ExportDonnees($searchCriteria: SearchDonneeCriteria) {
    exportDonnees(searchCriteria: $searchCriteria)
  }
`;

@Component({
  styleUrls: ["./view.component.scss"],
  templateUrl: "./view.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();

  private searchDonneeCriteria$: BehaviorSubject<SearchDonneeCriteria> = new BehaviorSubject<SearchDonneeCriteria>(null);

  public displayWaitPanel$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  constructor(
    private apollo: Apollo,
    private searchCriteriaService: SearchCriteriaService
  ) {
  }

  ngOnInit(): void {
    this.searchCriteriaService.getCurrentSearchDonneeCriteria$()
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe((searchDonneeCriteria) => {
        this.searchDonneeCriteria$.next(searchDonneeCriteria);
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onExcelExportClicked(): void {

    this.displayWaitPanel$.next(true);

    this.apollo.query<ExportDonneesResult, QueryExportDonneesArgs>({
      query: EXPORT_DONNEES,
      variables: {
        searchCriteria: this.searchDonneeCriteria$.value
      },
      fetchPolicy: "network-only"
    }).subscribe(({ data }) => {
      this.displayWaitPanel$.next(false);

      if (data?.exportDonnees) {
        downloadFile(DOWNLOAD_PATH + data?.exportDonnees, "donnees" + EXCEL_FILE_EXTENSION);
      }
    })

  }

}
