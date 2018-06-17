import { Component } from "@angular/core";
import { Response } from "@angular/http";
import { Commune } from "../../../model/commune.object";
import { Departement } from "../../../model/departement.object";
import { Lieudit } from "../../../model/lieudit.object";
import { EntiteSimpleFormComponent } from "../entite-simple/entite-simple-form.component";
import { EntiteSimpleService } from "../entite-simple/entite-simple.service";
import { GestionModeHelper } from "../gestion-mode.enum";

@Component({
    selector: "lieudit-form",
    templateUrl: "./lieudit-form.tpl.html"
})
export class LieuditFormComponent extends EntiteSimpleFormComponent<Lieudit> {

    public departements: Departement[];

    public communes: Commune[];

    constructor(private entiteSimpleService: EntiteSimpleService<Lieudit>,
                modeHelper: GestionModeHelper) {
        super(modeHelper);
    }

    ngOnInit(): void {
        // Get all departements
        this.entiteSimpleService.getAllObjects("departement")
            .subscribe(
                (result: Departement[]) => {
                    this.departements = result;
                }, (error: Response) => {
                    console.error("Impossible de trouver les départements (" + error + ")");
                });
        // Get all communes
        this.entiteSimpleService.getAllObjects("commune")
            .subscribe(
                (result: Commune[]) => {
                    this.communes = result;
                }, (error: Response) => {
                    console.error("Impossible de trouver les communes (" + error + ")");
                });
    }

    getNewObject(): Lieudit {
        return new Lieudit();
    }
}
