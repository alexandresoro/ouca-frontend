import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";

export class EntitesTableDataSource<T> implements DataSource<T> {

  protected entitesSubject = new BehaviorSubject<T[]>([]);

  protected countSubject = new BehaviorSubject<number>(0);
  public count$ = this.countSubject.asObservable();

  connect(): Observable<T[]> {
    return this.entitesSubject.asObservable();
  }

  disconnect(): void {
    this.entitesSubject.complete();
    this.countSubject.complete();
  }

  updateValues(newEntites: T[], newCount: number): void {
    this.countSubject.next(newCount);
    this.entitesSubject.next(newEntites);
  }

}