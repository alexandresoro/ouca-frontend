import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import {
  TEXT,
  UPDATE, WebsocketMessage, WebsocketUpdateContent, WebsocketUpdateMessage
} from "@ou-ca/ouca-model";
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
          this.sendMessage("ping");
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

  public getUpdateMessageContent$ = (): Observable<WebsocketUpdateContent> => {
    return this.getMessage$().pipe(
      filter((message) => {
        return message.type === UPDATE;
      }),
      map((updateMessage) => {
        return (updateMessage as WebsocketUpdateMessage).content;
      })
    );
  };

  public sendMessage = (message: string): void => {
    this.websocket$.next({
      type: TEXT,
      content: message
    });
  };
}
