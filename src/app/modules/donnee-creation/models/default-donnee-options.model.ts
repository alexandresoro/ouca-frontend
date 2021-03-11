import { Age } from 'src/app/model/types/age.object';
import { EstimationNombre } from 'src/app/model/types/estimation-nombre.object';
import { Sexe } from 'src/app/model/types/sexe.object';

export interface DefaultDonneeOptions {
  age: Age;
  sexe: Sexe;

  nombreGroup: {
    nombre: number;

    estimationNombre: EstimationNombre;
  };
}
