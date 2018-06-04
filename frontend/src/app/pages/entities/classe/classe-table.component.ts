import { Component } from "@angular/core";
import { Classe } from "../../../model/classe.object";
import { EntiteSimpleTableComponent } from "../entite-simple/entite-simple-table.component";

@Component({
    selector: "classe-table",
    templateUrl: "./../entite-avec-libelle/entite-avec-libelle-table.tpl.html",
})
export class ClasseTableComponent extends EntiteSimpleTableComponent<Classe> {
}
