import { Injectable } from "@angular/core";

@Injectable()
export class StatusHelper {

    private static SUCCESS: string = "SUCCESS";
    private static ERROR: string = "ERROR";
    private static INFO: string = "INFO";

    public isSucess(status: string): boolean {
        return StatusHelper.SUCCESS === status;
    }

    public isError(status: string): boolean {
        return StatusHelper.ERROR === status;
    }

    public isInfo(status: string): boolean {
        return StatusHelper.INFO === status;
    }
}
