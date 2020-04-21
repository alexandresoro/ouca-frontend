import { Injectable } from "@angular/core";
import { UPDATE } from "ouca-common/websocket/websocket-message-type.model";
import { WebsocketMessage } from "ouca-common/websocket/websocket-message.model";
import { WebsocketUpdateContent } from "ouca-common/websocket/websocket-update-content.model";
import { WebsocketUpdateMessage } from "ouca-common/websocket/websocket-update-message";
import { BehaviorSubject, Observable, Observer } from "rxjs";
import { filter, map, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class BackendWsService {
  private wsReceiver$: Observable<MessageEvent>;

  private ws: WebSocket;

  private isWebSocketOpen$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  constructor() {
    const websocketUrl =
      "ws://" + window.location.hostname + ":" + window.location.port + "/ws/";
    console.log("Trying to connect to websocket at " + websocketUrl);

    this.ws = new WebSocket(websocketUrl);

    this.wsReceiver$ = Observable.create((obs: Observer<MessageEvent>) => {
      this.ws.onmessage = obs.next.bind(obs);
      this.ws.onerror = obs.error.bind(obs);
      this.ws.onclose = obs.complete.bind(obs);
      return this.ws.close.bind(this.ws);
    });

    this.ws.onopen = (): void => {
      console.log("Connected to the backend websocket");
      this.isWebSocketOpen$.next(true);
    };
  }

  public getIsWebsocketOpen$ = (): Observable<boolean> => {
    return this.isWebSocketOpen$.asObservable();
  };

  private getMessage$ = (): Observable<WebsocketMessage> => {
    return this.wsReceiver$.pipe(
      map((message) => JSON.parse(message.data)),
      tap((data) => {
        console.log("Message received from websocket", data);
      })
    );
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

  public sendMessage = (
    data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView
  ): void => {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log("Message to be sent through websocket", data);
      this.ws.send(data);
    }
  };
}
