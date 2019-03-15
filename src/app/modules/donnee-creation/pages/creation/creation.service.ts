import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Comportement } from "../../../../model/comportement.object";
import { Donnee } from "../../../../model/donnee.object";
@Injectable()
export class CreationService {
  constructor(public http: HttpClient) {}

  /**
   * Update nombre when estimation nombre has changed
   * If non compte = true then nombre=null
   * If non compte = false and nombre=null, then nombre = defaultNombre
   * If non compte = false and nombre!=null, then we don't update nombre
   * @param donnee
   * @param defaultNombre
   */
  public updateNombreWhenEstimationHasChanged(
    donnee: Donnee,
    defaultNombre: number
  ): void {
    const nonCompte: boolean = donnee.estimationNombre.nonCompte;
    if (nonCompte) {
      donnee.nombre = null;
    } else {
      if (donnee.nombre == null) {
        donnee.nombre = defaultNombre;
      }
    }
  }

  public initComportements(): Comportement[] {
    const comportements: Comportement[] = new Array<Comportement>();
    for (
      let comportementIndex = 0;
      comportementIndex < 6;
      comportementIndex++
    ) {
      comportements.push(undefined);
    }
    return comportements;
  }
}
