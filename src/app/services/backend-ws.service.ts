import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  filter,
  map
} from "rxjs/operators";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { ImportErrorMessage, ImportUpdateMessage } from '../model/import/import-update-message';
import { WebsocketImportUpdateMessage } from '../model/websocket/websocket-import-update-message';
import { IMPORT } from '../model/websocket/websocket-message-type.model';
import { WebsocketMessage } from '../model/websocket/websocket-message.model';

@Injectable({
  providedIn: "root"
})
export class BackendWsService {
  private websocketUrl =
    "ws://" + window.location.hostname + ":" + window.location.port + "/ws/";

  private websocket$: WebSocketSubject<WebsocketMessage> = webSocket(
    this.websocketUrl
  );

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
