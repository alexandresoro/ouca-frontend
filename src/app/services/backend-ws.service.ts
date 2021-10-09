import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { BehaviorSubject, Observable, of, race, timer } from "rxjs";
import {
  catchError,
  concatMap,
  delay,
  distinctUntilChanged,
  filter,
  map,
  retryWhen,
  take,
  tap
} from "rxjs/operators";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { ImportErrorMessage, ImportUpdateMessage } from '../model/import/import-update-message';
import { WebsocketImportUpdateMessage } from '../model/websocket/websocket-import-update-message';
import { HEARTBEAT, IMPORT } from '../model/websocket/websocket-message-type.model';
import { WebsocketMessage } from '../model/websocket/websocket-message.model';
import { NetworkUnavailableDialogComponent } from "../modules/shared/components/network-unavailable-dialog/network-unavailable-dialog.component";

@Injectable({
  providedIn: "root"
})
export class BackendWsService {
  private websocketUrl =
    "ws://" + window.location.hostname + ":" + window.location.port + "/ws/";

  private websocket$: WebSocketSubject<WebsocketMessage> = webSocket(
    this.websocketUrl
  );

  private isWebsocketAlive$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  private matDialogRef: MatDialogRef<unknown>;

  constructor(private dialog: MatDialog) {
    this.websocket$
      .pipe(
        retryWhen((errors) => {
          return errors.pipe(
            tap(() => {
              this.isWebsocketAlive$.next(false);
            }),
            delay(1000)
          );
        })
      )
      .subscribe({
        next: (message) => {
          this.isWebsocketAlive$.next(true);
          console.log("Message received from websocket", message);
        },
        error: (error) => {
          this.isWebsocketAlive$.next(false);
          console.log("Error coming from websocket", error);
        }
      });

    timer(5000, 10000)
      .pipe(
        concatMap(() => {
          const result = race(
            of({ content: "timeout" }).pipe(delay(3_000)),
            this.websocket$.pipe(
              filter((m) => m?.content === "pong"),
              catchError(() => of({ content: "error" })),
              take(1)
            )
          );
          this.sendMessage({ type: HEARTBEAT, content: "ping" });
          return result;
        })
      )
      .subscribe((heartbeatMsg) => {
        if (heartbeatMsg?.content === "pong") {
          // Heartbeat is OK
          this.isWebsocketAlive$.next(true);
        } else {
          this.isWebsocketAlive$.next(false);
        }
      });

    this.isWebsocketAlive$
      .pipe(distinctUntilChanged())
      .subscribe((isWebsocketAlive) => {
        if (isWebsocketAlive) {
          this.matDialogRef?.close();
        } else {
          this.openNetworkUnavailableDialog();
        }
      });
  }

  private openNetworkUnavailableDialog = (): void => {
    this.matDialogRef = this.dialog.open(NetworkUnavailableDialogComponent, {
      width: "800px",
      hasBackdrop: true,
      disableClose: true
    });
  };

  private getMessage$ = (): Observable<WebsocketMessage> => {
    return this.websocket$.asObservable();
  };

  public getImportMessageContent$ = (): Observable<ImportUpdateMessage | ImportErrorMessage> => {
    return this.getMessage$().pipe(
      filter((message) => {
        return message.type === IMPORT;
      }),
      map((importMessage: WebsocketImportUpdateMessage) => {
        return importMessage.content;
      })
    );
  }

  public sendMessage = (message: WebsocketMessage): void => {
    this.websocket$.next(message);
  };

}
