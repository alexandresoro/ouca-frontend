import { Commune } from "./commune.object";
import { EntiteAvecLibelle } from "./entite-avec-libelle.object";

export class Lieudit extends EntiteAvecLibelle {

    public commune: Commune;

    public nom: string;

    public altitude: number;

    public longitude: number;

    public latitude: number;

    constructor() {
        super();
    }
}
