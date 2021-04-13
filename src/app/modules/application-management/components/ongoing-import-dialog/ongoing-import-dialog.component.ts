import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { saveAs } from "file-saver";
import Papa from 'papaparse';
import { Observable, Subject } from 'rxjs';
import { filter, map, shareReplay, withLatestFrom } from 'rxjs/operators';
import { DATA_VALIDATION_START, ImportErrorMessage, ImportNotifyProgressMessage, ImportNotifyProgressMessageContent, ImportNotifyStatusUpdateMessage, ImportPostCompleteMessage, ImportUpdateMessage, IMPORT_COMPLETE, IMPORT_ERROR, IMPORT_PROCESS_STARTED, INSERT_DB_START, RETRIEVE_DB_INFO_START, StatusUpdate, VALIDATION_PROGRESS } from 'src/app/model/import/import-update-message';
import { BackendWsService } from 'src/app/services/backend-ws.service';

@Component({
  selector: "ongoing-import-dialog",
  styleUrls: ["./ongoing-import-dialog.component.scss"],
  templateUrl: "./ongoing-import-dialog.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OngoingImportDialog implements OnInit {

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

  private STATUS_MESSAGE_MAPPING: Record<StatusUpdate, string> = {
    IMPORT_PROCESS_STARTED: "Début de la procédure d'import",
    RETRIEVE_DB_INFO_START: "Récupération des informations nécéssaires à la validation",
    DATA_VALIDATION_START: "Validation des données à importer",
    INSERT_DB_START: "Insertion dans la base en cours"
  }

  constructor(
    private backendWsService: BackendWsService
  ) {

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

    this.isImportSuccessful$ = this.importCompleteInformation$.pipe(
      map(message => !message.fileInputError && !message.lineErrors)
    );

    this.fileInputError$ = this.importCompleteInformation$.pipe(
      filter(message => !!message.fileInputError),
      map(message => message.fileInputError)
    );

    this.saveErrorFileClick$.pipe(withLatestFrom(this.lineErrors$)).subscribe(([e, lineErrors]) => {
      const errorsCsv = Papa.unparse(lineErrors, {
        delimiter: ";"
      });
      const errorsBlob = new Blob([errorsCsv], { type: "text/csv;charset=utf-8" });
      saveAs(errorsBlob, "erreurs.csv");
    })

  }

  onSaveErrorFileClicked = (event: Event): void => {
    this.saveErrorFileClick$.next(event);
  };


}
