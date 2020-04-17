import { Age } from "ouca-common/age.object";
import { EstimationNombre } from "ouca-common/estimation-nombre.object";
import { Sexe } from "ouca-common/sexe.object";

export interface DefaultDonneeOptions {
  age: Age;
  sexe: Sexe;

  nombreGroup: {
    nombre: number;

    estimationNombre: EstimationNombre;
  };
}
