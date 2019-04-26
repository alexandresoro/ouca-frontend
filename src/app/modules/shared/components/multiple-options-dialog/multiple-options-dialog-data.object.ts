export class MultipleOptionsDialogData {
  title: string;

  content: string;

  options: any[];

  constructor(title: string, content: string, options: any[]) {
    this.title = title;
    this.content = content;
    this.options = options;
  }
}
