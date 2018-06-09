import { Component } from "@angular/core";
import { Classe } from "../../../model/classe.object";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
    templateUrl: "./classe.tpl.html",
})
export class ClasseComponent extends EntiteSimpleComponent<Classe> {

    public getEntityName(): string {
        return "classe";
    }

    public getNewObject(): Classe {
        return new Classe();
    }
}
