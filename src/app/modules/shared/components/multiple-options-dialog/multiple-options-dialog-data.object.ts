export interface MultipleOptionsDialogOption {
  value?: number;
  label: string;
  color: string;
}

export interface MultipleOptionsDialogData {
  title: string;

  content: string;

  options: MultipleOptionsDialogOption[];
}
