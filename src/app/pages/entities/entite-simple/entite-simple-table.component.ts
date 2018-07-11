import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { EntiteSimple } from "../../../model/entite-simple.object";

@Component({
  template: ""
})
export class EntiteSimpleTableComponent<T extends EntiteSimple>
  implements OnChanges {
  @Input() public objects: T[];

  @Output() public delete: EventEmitter<T> = new EventEmitter<T>();

  @Output() public edit: EventEmitter<T> = new EventEmitter<T>();

  @Output() public view: EventEmitter<T> = new EventEmitter<T>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  public dataSource: MatTableDataSource<any>;

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.objects && !!changes.objects.currentValue) {
      this.dataSource = new MatTableDataSource(changes.objects.currentValue);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  public deleteObject(object: T): void {
    this.delete.emit(object);
  }

  public editObject(object: T): void {
    this.edit.emit(object);
  }

  public viewObject(object: T): void {
    this.view.emit(object);
  }

  public applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
