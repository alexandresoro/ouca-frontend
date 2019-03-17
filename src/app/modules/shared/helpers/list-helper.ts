import { Age } from "basenaturaliste-model/age.object";
import { Classe } from "basenaturaliste-model/classe.object";
import { Commune } from "basenaturaliste-model/commune.object";
import { Comportement } from "basenaturaliste-model/comportement.object";
import { Departement } from "basenaturaliste-model/departement.object";
import { EstimationDistance } from "basenaturaliste-model/estimation-distance.object";
import { EstimationNombre } from "basenaturaliste-model/estimation-nombre.object";
import { Lieudit } from "basenaturaliste-model/lieudit.object";
import { Meteo } from "basenaturaliste-model/meteo.object";
import { Milieu } from "basenaturaliste-model/milieu.object";
import { Observateur } from "basenaturaliste-model/observateur.object";
import { Sexe } from "basenaturaliste-model/sexe.object";

export class ListHelper {
  private ages: Age[];
  private classes: Classe[];

  private communes: Commune[];

  private milieux: Milieu[];

  private comportements: Comportement[];

  private sexes: Sexe[];

  private departements: Departement[];

  private lieuxDits: Lieudit[];

  private observateurs: Observateur[];

  private estimationsNombre: EstimationNombre[];

  private estimationsDistance: EstimationDistance[];

  private meteos: Meteo[];

  constructor(
    ages: Age[],
    classes: Classe[],
    communes: Commune[],
    comportements: Comportement[],
    departements: Departement[],
    estimationsDistance: EstimationDistance[],
    estimationsNombre: EstimationNombre[],
    lieuxDits: Lieudit[],
    meteos: Meteo[],
    milieux: Milieu[],
    observateurs: Observateur[],
    sexes: Sexe[]
  ) {
    this.ages = ages;
    this.classes = classes;
    this.communes = communes;
    this.comportements = comportements;
    this.departements = departements;
    this.estimationsDistance = estimationsDistance;
    this.estimationsNombre = estimationsNombre;
    this.lieuxDits = lieuxDits;
    this.meteos = meteos;
    this.milieux = milieux;
    this.observateurs = observateurs;
    this.sexes = sexes;
  }

  public getDepartementById(id: number): Departement {
    return this.departements.find((departement) => departement.id === id);
  }

  public getCommuneById(id: number): Commune {
    return this.communes.find((commune) => commune.id === id);
  }

  public getClasseById(id: number): Classe {
    return this.classes.find((classe) => classe.id === id);
  }

  public getAgeById(id: number): Age {
    return this.ages.find((age) => age.id === id);
  }

  public getSexeById(id: number): Sexe {
    return this.sexes.find((sexe) => sexe.id === id);
  }

  public getEstimationNombreById(id: number): EstimationNombre {
    return this.estimationsNombre.find((estimation) => estimation.id === id);
  }
}
