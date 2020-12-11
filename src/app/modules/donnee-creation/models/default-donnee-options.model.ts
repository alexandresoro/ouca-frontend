import { Age } from "@ou-ca/ouca-model/age.object";
import { EstimationNombre } from "@ou-ca/ouca-model/estimation-nombre.object";
import { Sexe } from "@ou-ca/ouca-model/sexe.object";

export interface DefaultDonneeOptions {
  age: Age;
  sexe: Sexe;

  nombreGroup: {
    nombre: number;

    estimationNombre: EstimationNombre;
  };
}
