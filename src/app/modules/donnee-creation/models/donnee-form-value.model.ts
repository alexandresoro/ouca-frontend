import { Age } from "@ou-ca/ouca-model/age.object";
import { Classe } from "@ou-ca/ouca-model/classe.object";
import { Comportement } from "@ou-ca/ouca-model/comportement.object";
import { EstimationDistance } from "@ou-ca/ouca-model/estimation-distance.object";
import { EstimationNombre } from "@ou-ca/ouca-model/estimation-nombre.object";
import { Milieu } from "@ou-ca/ouca-model/milieu.object";
import { Sexe } from "@ou-ca/ouca-model/sexe.object";
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
