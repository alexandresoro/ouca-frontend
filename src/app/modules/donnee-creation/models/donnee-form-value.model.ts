import { Age, Classe, Comportement, Espece, EstimationDistance, EstimationNombre, Milieu, Sexe } from "src/app/model/graphql";

export interface DonneeFormValue {
  id: number;
  especeGroup: {
    classe: Classe;
    espece: Partial<Espece>;
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
