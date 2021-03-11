import { Age } from 'src/app/model/types/age.object';
import { Classe } from 'src/app/model/types/classe.object';
import { Comportement } from 'src/app/model/types/comportement.object';
import { EstimationDistance } from 'src/app/model/types/estimation-distance.object';
import { EstimationNombre } from 'src/app/model/types/estimation-nombre.object';
import { Milieu } from 'src/app/model/types/milieu.object';
import { Sexe } from 'src/app/model/types/sexe.object';
import { UIEspece } from "src/app/models/espece.model";

export interface DonneeFormValue {
  id: number;
  especeGroup: {
    classe: Classe;
    espece: UIEspece;
  };
  nombreGroup: {
    nombre: number;
    estimationNombre: EstimationNombre;
  };
  sexe: Sexe;
  age: Age;
  distanceGroup: {
    distance: number;
    estimationDistance: EstimationDistance;
  };
  regroupement: number;
  comportementsGroup: {
    comportement1: Comportement;
    comportement2: Comportement;
    comportement3: Comportement;
    comportement4: Comportement;
    comportement5: Comportement;
    comportement6: Comportement;
  };
  milieuxGroup: {
    milieu1: Milieu;
    milieu2: Milieu;
    milieu3: Milieu;
    milieu4: Milieu;
  };
  commentaire: string;
}
