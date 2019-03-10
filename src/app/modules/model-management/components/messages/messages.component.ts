import {Component, Input} from "@angular/core";

@Component({
    selector: "entity-messages",
    templateUrl: "./messages.tpl.html"
})
export class EntityMessagesComponent {

    @Input() status: string;

    @Input() messages: any[];

}
