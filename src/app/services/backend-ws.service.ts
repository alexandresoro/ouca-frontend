import { Injectable } from "@angular/core";
import { UPDATE } from "ouca-common/websocket/websocket-message-type.model";
import { WebsocketMessage } from "ouca-common/websocket/websocket-message.model";
import { WebsocketUpdateContent } from "ouca-common/websocket/websocket-update-content.model";
import { WebsocketUpdateMessage } from "ouca-common/websocket/websocket-update-message";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

@Injectable({
  providedIn: "root"
})
export class BackendWsService {
  private websocketUrl =
    "ws://" + window.location.hostname + ":" + window.location.port + "/ws/";

  private websocket$: WebSocketSubject<WebsocketMessage> = webSocket(
    this.websocketUrl
  );

  constructor() {
    this.websocket$.subscribe({
      next: (message) => {
        console.log("Message received from websocket", message);
      },
      error: (error) => {
        console.log("Error coming from websocket", error);
      }
    });
  }

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
}
