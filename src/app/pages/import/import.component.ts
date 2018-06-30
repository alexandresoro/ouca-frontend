import { Component } from "@angular/core";

@Component({
    templateUrl: "./import.tpl.html"
})
export class ImportComponent {

    /* CALLED FROM THE UI */
    public onImportObservateursClicked(): void {
        alert("file");
    }

    /* END CALLED FROM THE UI */
}
