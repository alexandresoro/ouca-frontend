import { Age } from "./age.object";
import { Departement } from "./departement.object";
import { EstimationNombre } from "./estimation-nombre.object";
import { Observateur } from "./observateur.object";
import { Sexe } from "./sexe.object";

export class ConfigurationPage {

    applicationName: string;

    defaultObservateur: Observateur;

    defaultDepartement: Departement;

    defaultEstimationNombre: EstimationNombre;

    defaultNombre: number;

    defaultSexe: Sexe;

    defaultAge: Age;

    areAssociesDisplayed: boolean;

    isMeteoDisplayed: boolean;

    isDistanceDisplayed: boolean;

    isRegroupementDisplayed: boolean;

    displayedColumns: string;

    mySqlPath: string;

    mySqlDumpPath: string;

    observateurs: Observateur[];

    departements: Departement[];

    estimationsNombre: EstimationNombre[];

    sexes: Sexe[];

    ages: Age[];

    // tslint:disable-next-line:no-empty
    constructor() {
    }

}
