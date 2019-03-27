import { Component } from "@angular/core";
import {
  PageStatus,
  PageStatusHelper
} from "../../../shared/helpers/page-status.helper";

@Component({
  selector: "entity-messages",
  templateUrl: "./messages.tpl.html"
})
export class EntityMessagesComponent {
  public pageStatusHelper = PageStatusHelper;

  public pageStatusEnum = PageStatus;
}
