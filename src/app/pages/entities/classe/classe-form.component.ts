import { Component } from "@angular/core";
import { Classe } from "../../../model/classe.object";
import { EntiteSimpleFormComponent } from "../entite-simple/entite-simple-form.component";

@Component({
    selector: "classe-form",
    templateUrl: "./../entite-avec-libelle/entite-avec-libelle-form.tpl.html",
})
export class ClasseFormComponent extends EntiteSimpleFormComponent<Classe> {

    public getNewObject(): Classe {
        return new Classe();
    }
}
