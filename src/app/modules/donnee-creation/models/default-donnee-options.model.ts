import { Age, EstimationNombre, Sexe } from "@ou-ca/ouca-model";

export interface DefaultDonneeOptions {
  age: Age;
  sexe: Sexe;

  nombreGroup: {
    nombre: number;

    estimationNombre: EstimationNombre;
  };
}
