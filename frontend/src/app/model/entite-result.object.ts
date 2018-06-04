import { EntiteSimple } from "./entite-simple.object";

export class EntiteResult<T extends EntiteSimple> {

    public object: T;

    public messages: any;

    public status: string;

    // tslint:disable-next-line:no-empty
    constructor() {
    }

}
