import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { EntiteSimple } from "ouca-common/entite-simple.object";

@Component({
  template: ""
})
export class EntiteSimpleTableComponent<T extends EntiteSimple>
  implements OnInit, OnChanges {
  @Input() public objects: T[];

  @Output() public delete: EventEmitter<T> = new EventEmitter<T>();

  @Output() public edit: EventEmitter<T> = new EventEmitter<T>();

  @Output() public view: EventEmitter<T> = new EventEmitter<T>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public dataSource: MatTableDataSource<unknown> = new MatTableDataSource();

  public selectedObject: T;

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.objects?.currentValue) {
      this.dataSource.data = changes.objects.currentValue;
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

  public onRowClicked(object: T): void {
    if (!!this.selectedObject && this.selectedObject.id === object.id) {
      this.selectedObject = undefined;
    } else {
      this.selectedObject = object;
    }
  }
}
