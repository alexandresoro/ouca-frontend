import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Response } from "@angular/http";
import { Classe } from "../../../model/classe.object";
import { Espece } from "../../../model/espece.object";
import { EntiteSimpleFormComponent } from "../entite-simple/entite-simple-form.component";
import { EntiteSimpleService } from "../entite-simple/entite-simple.service";
import { GestionModeHelper } from "../gestion-mode.enum";

@Component({
    selector: "espece-form",
    templateUrl: "./espece-form.tpl.html"
})
export class EspeceFormComponent extends EntiteSimpleFormComponent<Espece> {

    public classes: Classe[];

    public codeFormControl = new FormControl("", [Validators.required]);
    public nomFrancaisFormControl = new FormControl("", [Validators.required]);
    public nomLatinFormControl = new FormControl("", [Validators.required]);

    constructor(private entiteSimpleService: EntiteSimpleService<Espece>,
                modeHelper: GestionModeHelper) {
        super(modeHelper);
    }

    ngOnInit(): void {
        // Get all communes
        this.entiteSimpleService.getAllObjects("classe")
            .subscribe(
                (result: Classe[]) => {
                    this.classes = result;
                }, (error: Response) => {
                    console.error("Impossible de trouver les classes (" + error + ")");
                });
    }

    getNewObject(): Espece {
        return new Espece();
    }
}
