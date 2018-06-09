import { Component } from "@angular/core";
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

    constructor(private entiteSimpleService: EntiteSimpleService<Espece>,
                modeHelper: GestionModeHelper) {
        super(modeHelper);
    }

    ngOnInit(): void {
        // Get all communes
        this.entiteSimpleService.getAll("classe")
            .subscribe((response: Response) => {
                console.log("Toutes les Classes:", response.json());
                this.classes = response.json();
            }, (error: Response) => {
                console.error("Impossible de trouver les classes (" + error + ")");
            });
    }

    getNewObject(): Espece {
        return new Espece();
    }
}
