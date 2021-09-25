import { Age, EstimationNombre, Sexe } from "src/app/model/graphql";

export interface DefaultDonneeOptions {
  age: Age;
  sexe: Sexe;

  nombreGroup: {
    nombre: number;

    estimationNombre: EstimationNombre;
  };
}
