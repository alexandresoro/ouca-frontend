export class PageComponent {

    private STATUS_ERROR: string = "ERROR";
    private STATUS_SUCCESS: string = "SUCCESS";

    public messages: any[];
    public status: string;

    public updatePageStatus(status: string, messages: any[]) {
        this.status = status;
        this.messages = messages;
    }

    public isSuccess(): boolean {
        return this.status === this.STATUS_SUCCESS;
    }

    public isSuccessStatus(status: string): boolean {
        return status === this.STATUS_SUCCESS;
    }

    public setErrorMessage(message: string): void {
        this.status = this.STATUS_ERROR;
        this.messages = [{ value: message }];
    }

    public clearMessages(): void {
        this.messages = [];
    }
}
