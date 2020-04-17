import { Age } from "ouca-common/age.object";
import { Classe } from "ouca-common/classe.object";
import { Comportement } from "ouca-common/comportement.object";
import { EstimationDistance } from "ouca-common/estimation-distance.object";
import { EstimationNombre } from "ouca-common/estimation-nombre.object";
import { Milieu } from "ouca-common/milieu.object";
import { Sexe } from "ouca-common/sexe.object";
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
