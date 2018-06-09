import { Component } from "@angular/core";
import { Response } from "@angular/http";
import { Commune } from "../../../model/commune.object";
import { Departement } from "../../../model/departement.object";
import { EntiteSimpleFormComponent } from "../entite-simple/entite-simple-form.component";
import { EntiteSimpleService } from "../entite-simple/entite-simple.service";
import { GestionModeHelper } from "../gestion-mode.enum";

@Component({
    selector: "commune-form",
    templateUrl: "./commune-form.tpl.html"
})
export class CommuneFormComponent extends EntiteSimpleFormComponent<Commune> {

    public departements: Departement[];

    constructor(private entiteSimpleService: EntiteSimpleService<Commune>,
                modeHelper: GestionModeHelper) {
        super(modeHelper);
    }

    ngOnInit() {
        // Get all departements
        this.entiteSimpleService.getAll("departement")
            .subscribe((response: Response) => {
                console.log("All Départements:", response.json());
                this.departements = response.json();
            }, (error: Response) => {
                console.error("Impossible de trouver les départements (" + error + ")");
            });
    }

    getNewObject(): Commune {
        return new Commune();
    }
}
