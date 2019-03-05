import { Age } from "./age.object";
import { Comportement } from "./comportement.object";
import { EntiteSimple } from "./entite-simple.object";
import { Espece } from "./espece.object";
import { EstimationDistance } from "./estimation-distance.object";
import { EstimationNombre } from "./estimation-nombre.object";
import { Inventaire } from "./inventaire.object";
import { Milieu } from "./milieu.object";
import { Sexe } from "./sexe.object";

export class Donnee extends EntiteSimple {
  public id: number;

  public inventaire: Inventaire;

  public inventaireId: number;

  public espece: Espece;

  public estimationNombre: EstimationNombre;

  public nombre: number;

  public age: Age;

  public sexe: Sexe;

  public estimationDistance: EstimationDistance;

  public distance: number;

  public regroupement: number;

  public comportements: Comportement[] = [];

  public milieux: Milieu[] = [];

  public commentaire: string;

  constructor() {
    super();
  }
}
