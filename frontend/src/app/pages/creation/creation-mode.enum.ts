import { Injectable } from "@angular/core";

export enum CreationMode {
    NEW_INVENTAIRE,
    NEW_DONNEE,
    UPDATE,
}

@Injectable()
export class CreationModeHelper {

    public isInventaireMode(mode: CreationMode): boolean {
        return CreationMode.NEW_INVENTAIRE === mode;
    }

    public isDonneeMode(mode: CreationMode): boolean {
        return CreationMode.NEW_DONNEE === mode;
    }

    public isUpdateMode(mode: CreationMode): boolean {
        return CreationMode.UPDATE === mode;
    }
}
