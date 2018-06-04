import { Departement } from "./departement.object";
import { EntiteSimple } from "./entite-simple.object";

export class Commune extends EntiteSimple {

    public departement: Departement;

    public code: string;

    public nom: string;

    constructor() {
        super();
    }

}
