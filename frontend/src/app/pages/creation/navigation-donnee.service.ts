import { Injectable } from "@angular/core";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { BaseNaturalisteService } from "./../../services/base-naturaliste.service";

@Injectable()
export class NavigationDonneService extends BaseNaturalisteService {

    constructor() {
        super();
    }
}
