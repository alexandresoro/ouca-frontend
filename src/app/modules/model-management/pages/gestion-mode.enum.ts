import { Injectable } from "@angular/core";

export enum GestionMode {
    VIEW_ALL,
    VIEW_ONE,
    CREATION,
    EDITION,
    REMOVE,
}

@Injectable()
export class GestionModeHelper {

    public isViewAllMode(mode: GestionMode): boolean {
        return GestionMode.VIEW_ALL === mode;
    }

    public isEditionMode(mode: GestionMode): boolean {
        return GestionMode.EDITION === mode;
    }

    public isCreationMode(mode: GestionMode): boolean {
        return GestionMode.CREATION === mode;
    }

    public isViewOneMode(mode: GestionMode): boolean {
        return GestionMode.VIEW_ONE === mode;
    }

    public isRemoveMode(mode: GestionMode): boolean {
        return GestionMode.REMOVE === mode;
    }
}
