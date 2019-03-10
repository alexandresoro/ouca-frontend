export class ConfirmationDialogData {
  title: string;

  content: string;

  validateLabel: string;

  cancelLabel: string;

  constructor(
    title: string,
    content: string,
    validateLabel: string,
    cancelLabel: string
  ) {
    this.title = title;
    this.content = content;
    this.validateLabel = validateLabel;
    this.cancelLabel = cancelLabel;
  }
}
