import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Classe } from "ouca-common/classe.object";
import { EntiteAvecLibelleComponent } from "../entite-avec-libelle/entite-avec-libelle.component";

@Component({
  templateUrl: "./classe.tpl.html"
})
export class ClasseComponent extends EntiteAvecLibelleComponent<Classe> {
  public ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup(
      {
        id: new FormControl("", []),
        libelle: new FormControl("", [Validators.required]),
        nbDonnees: new FormControl("", []),
        nbEspeces: new FormControl("", [])
      },
      [this.libelleValidator]
    );
  }

  public getEntityName(): string {
    return "classe";
  }

  public getAnEntityLabel(): string {
    return "une classec";
  }

  public getTheEntityLabel(uppercase?: boolean): string {
    return uppercase ? "La classe" : "la classe";
  }
}
