import { Component } from "@angular/core";

@Component({
  templateUrl: "./view.tpl.html"
})
export class ViewComponent {
  public selectOptions: any[] = [
    {
      key: "id",
      libelle: "ID",
      isSelected: true
    },
    {
      key: "observateur",
      libelle: "Observateur",
      isSelected: false
    }
  ];

  public whereOptions: any[] = [
    {
      column: {},
      operand: {},
      value: ""
    }
  ];

  public whereColumns: any[] = [
    {
      key: "id",
      libelle: "ID"
    },
    {
      key: "observateur",
      libelle: "Observateur"
    }
  ];

  public operands: any[] = [
    {
      key: "=",
      libelle: "="
    },
    {
      key: "!=",
      libelle: "!="
    }
  ];

  constructor() {
    // TODO
  }

  public ngOnInit(): void {
    // TODO
  }

  public onSearchButtonClicked(): void {
    console.log("SELECT", this.selectOptions);
    console.log("WHERE", this.whereOptions);
  }

  public onAddWhereOptionButtonClicked(): void {
    this.whereOptions.push({
      column: {},
      operand: {},
      value: ""
    });
  }

  public onDeleteWhereOptionButtonClicked(index: number): void {
    this.whereOptions.splice(index, 1);
  }

  public onUpWhereOptionButtonClicked(index: number): void {
    const optionToMove = this.whereOptions[index];
    this.whereOptions[index] = this.whereOptions[index - 1];
    this.whereOptions[index - 1] = optionToMove;
  }

  public onBottomWhereOptionButtonClicked(index: number): void {
    const optionToMove = this.whereOptions[index];
    this.whereOptions[index] = this.whereOptions[index + 1];
    this.whereOptions[index + 1] = optionToMove;
  }

  public onUpSelectOptionButtonClicked(index: number): void {
    const optionToMove = this.selectOptions[index];
    this.selectOptions[index] = this.selectOptions[index - 1];
    this.selectOptions[index - 1] = optionToMove;
  }

  public onBottomSelectOptionButtonClicked(index: number): void {
    const optionToMove = this.selectOptions[index];
    this.selectOptions[index] = this.selectOptions[index + 1];
    this.selectOptions[index + 1] = optionToMove;
  }
}
