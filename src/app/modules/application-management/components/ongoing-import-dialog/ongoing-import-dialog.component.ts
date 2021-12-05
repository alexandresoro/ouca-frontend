import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Apollo, gql, QueryRef } from "apollo-angular";
import { Observable, Subject } from 'rxjs';
import { filter, map, shareReplay, take, takeUntil } from 'rxjs/operators';
import { ImportErrorType, ImportStatus, ImportStatusEnum, OngoingSubStatus, OngoingValidationStats, QueryImportStatusArgs } from "src/app/model/graphql";

type ImportStatusQueryResult = {
  importStatus: ImportStatus
}

const IMPORT_STATUS_QUERY = gql`
  query ImportStatus($importId: String!) {
    importStatus(importId: $importId) {
      status
      subStatus
      errorType
      errorDescription
      importErrorsReportFile
      ongoingValidationStats {
        totalLines
        totalEntries
        nbEntriesChecked
        nbEntriesWithErrors
      }
    }
  }
`

@Component({
  selector: "ongoing-import-dialog",
  styleUrls: ["./ongoing-import-dialog.component.scss"],
  templateUrl: "./ongoing-import-dialog.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OngoingImportDialog implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject();

  isImportFinished$: Observable<boolean>;

  importCompleteInformation$: Observable<ImportStatus>;

  isImportSuccessful$: Observable<boolean>;

  inputFileImportError$: Observable<string>;

  lineErrorsAfterCompletion$: Observable<number>;

  importProgressStatus$: Observable<OngoingValidationStats>;

  importProgressPercentage$: Observable<number>;

  currentStepText$: Observable<string>;

  errorFileUrlSafe: SafeUrl;

  private queryRef: QueryRef<ImportStatusQueryResult, QueryImportStatusArgs>;


  private STATUS_MESSAGE_MAPPING: Record<OngoingSubStatus, string> = {
    PROCESS_STARTED: "Début de la procédure d'import",
    RETRIEVING_REQUIRED_DATA: "Préparation des données nécessaires pour l'import",
    VALIDATING_INPUT_FILE: "Validation des données à importer",
    INSERTING_IMPORTED_DATA: "Insertion des données valides dans la base de données"
  }

  constructor(
    private apollo: Apollo,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: { importId: string },
  ) {

  }

  ngOnInit(): void {

    this.queryRef = this.apollo.watchQuery<ImportStatusQueryResult, QueryImportStatusArgs>({
      query: IMPORT_STATUS_QUERY,
      variables: {
        importId: this.data.importId
      },
      fetchPolicy: "no-cache",
      pollInterval: 500
    });

    const importStatus$ = this.queryRef.valueChanges.pipe(
      map(({ data }) => {
        return data?.importStatus;
      })
    );

    this.importProgressStatus$ = importStatus$.pipe(
      filter(importStatus => importStatus?.status === ImportStatusEnum.Ongoing && importStatus?.subStatus === OngoingSubStatus.ValidatingInputFile),
      map(progressMessage => progressMessage.ongoingValidationStats),
      shareReplay(1)
    );

    this.importProgressPercentage$ = this.importProgressStatus$.pipe(
      map((importProgressStatus) => {
        return (100 * importProgressStatus.nbEntriesChecked / importProgressStatus.totalEntries);
      }),
      shareReplay(1)
    );

    this.currentStepText$ = importStatus$.pipe(
      filter(importStatus => importStatus?.status === ImportStatusEnum.Ongoing),
      map((importStatus) => this.STATUS_MESSAGE_MAPPING[importStatus?.subStatus]),
      shareReplay(1)
    )

    this.isImportFinished$ = importStatus$.pipe(map(importStatus => importStatus?.status === ImportStatusEnum.Complete || importStatus?.status === ImportStatusEnum.Failed));
    this.importCompleteInformation$ = importStatus$.pipe(
      filter(importStatus => (importStatus?.status === ImportStatusEnum.Complete)),
    );

    importStatus$.pipe(
      filter(importStatus => importStatus?.status === ImportStatusEnum.Complete || importStatus?.status === ImportStatusEnum.Failed),
      take(1)
    ).subscribe(() => {
      this.queryRef.stopPolling();
    })

    this.lineErrorsAfterCompletion$ = this.importCompleteInformation$.pipe(
      map(importStatus => importStatus?.ongoingValidationStats?.nbEntriesWithErrors)
    )

    this.importCompleteInformation$.pipe(
      takeUntil(this.destroy$)
    )
      .subscribe((importStatus) => {
        if (importStatus?.importErrorsReportFile) {
          this.errorFileUrlSafe = this.sanitizer.bypassSecurityTrustUrl(importStatus.importErrorsReportFile);
        }
      });

    this.isImportSuccessful$ = this.importCompleteInformation$.pipe(
      map(importStatus => !importStatus.importErrorsReportFile)
    );

    this.inputFileImportError$ = this.importCompleteInformation$.pipe(
      filter(importStatus => importStatus?.status === ImportStatusEnum.Failed && importStatus?.errorType === ImportErrorType.ImportFailure),
      map(importStatus => importStatus.errorDescription)
    );

  }

  ngOnDestroy(): void {
    this.queryRef.stopPolling();
    this.destroy$.next();
    this.destroy$.complete();
  }

}
