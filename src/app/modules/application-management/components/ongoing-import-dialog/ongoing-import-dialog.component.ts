import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { DATA_VALIDATION_START, ImportErrorMessage, ImportNotifyProgressMessage, ImportNotifyProgressMessageContent, ImportNotifyStatusUpdateMessage, ImportPostCompleteMessage, ImportUpdateMessage, IMPORT_COMPLETE, IMPORT_ERROR, IMPORT_PROCESS_STARTED, INSERT_DB_START, RETRIEVE_DB_INFO_START, StatusUpdate, VALIDATION_PROGRESS } from 'src/app/model/import/import-update-message';
import { exportAsCsv } from 'src/app/modules/shared/helpers/csv-utils.helper';
import { BackendWsService } from 'src/app/services/backend-ws.service';

@Component({
  selector: "ongoing-import-dialog",
  styleUrls: ["./ongoing-import-dialog.component.scss"],
  templateUrl: "./ongoing-import-dialog.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OngoingImportDialog implements OnInit, OnDestroy {

  importMessage$: Observable<ImportUpdateMessage | ImportErrorMessage>;

  isImportFinished$: Observable<boolean>;

  importCompleteInformation$: Observable<ImportPostCompleteMessage>;

  isImportSuccessful$: Observable<boolean>;

  fileInputError$: Observable<string>;

  lineErrors$: Observable<string[][]>;

  importProgressStatus$: Observable<ImportNotifyProgressMessageContent>;

  importProgressPercentage$: Observable<number>;

  currentStepText$: Observable<string>;

  private saveErrorFileClick$ = new Subject<Event>();


  errorFileUrl: string;

  errorFileUrlSafe: SafeUrl;

  private STATUS_MESSAGE_MAPPING: Record<StatusUpdate, string> = {
    IMPORT_PROCESS_STARTED: "Début de la procédure d'import",
    RETRIEVE_DB_INFO_START: "Préparation des données nécessaires pour l'import",
    DATA_VALIDATION_START: "Validation des données à importer",
    INSERT_DB_START: "Insertion des données valides dans la base de données"
  }

  constructor(
    private sanitizer: DomSanitizer,
    private backendWsService: BackendWsService
  ) {

  }
  ngOnDestroy(): void {
    if (this.errorFileUrl) {
      URL.revokeObjectURL(this.errorFileUrl);
    }
  }

  ngOnInit(): void {

    this.importMessage$ = this.backendWsService.getImportMessageContent$();

    this.importProgressStatus$ = this.importMessage$.pipe(
      filter<ImportNotifyProgressMessage>(message => (message?.type === VALIDATION_PROGRESS)),
      map(progressMessage => progressMessage.progress),
      shareReplay(1)
    );

    this.importProgressPercentage$ = this.importProgressStatus$.pipe(
      map((importProgressStatus) => {
        return (100 * importProgressStatus.validatedEntries / importProgressStatus.entriesToBeValidated);
      }),
      shareReplay(1)
    );

    this.currentStepText$ = this.importMessage$.pipe(
      filter(message => [IMPORT_PROCESS_STARTED, RETRIEVE_DB_INFO_START, DATA_VALIDATION_START, INSERT_DB_START].includes(message?.type)),
      map<ImportNotifyStatusUpdateMessage, string>((message) => this.STATUS_MESSAGE_MAPPING[message.type]),
      shareReplay(1)
    )

    this.isImportFinished$ = this.importMessage$.pipe(map(message => [IMPORT_ERROR, IMPORT_COMPLETE].includes(message?.type)));
    this.importCompleteInformation$ = this.importMessage$.pipe(
      filter<ImportPostCompleteMessage>(message => (message?.type === IMPORT_COMPLETE)),
    );

    this.lineErrors$ = this.importCompleteInformation$.pipe(
      filter(message => !!message.lineErrors?.length),
      map(message => message.lineErrors),
    );

    this.lineErrors$.subscribe((lineErrors) => {
      if (!lineErrors) {
        return;
      }

      const errorsCsv = exportAsCsv(lineErrors, { delimiter: ";", isCrLf: true });
      const errorsBlob = new Blob([errorsCsv], { type: "text/csv;charset=utf-8" });
      this.errorFileUrl = URL.createObjectURL(errorsBlob);
      this.errorFileUrlSafe = this.sanitizer.bypassSecurityTrustUrl(this.errorFileUrl);

    });

    this.isImportSuccessful$ = this.importCompleteInformation$.pipe(
      map(message => !message.fileInputError && !message.lineErrors)
    );

    this.fileInputError$ = this.importCompleteInformation$.pipe(
      filter(message => !!message.fileInputError),
      map(message => message.fileInputError)
    );

  }

  onSaveErrorFileClicked = (event: Event): void => {
    this.saveErrorFileClick$.next(event);
  };


}
