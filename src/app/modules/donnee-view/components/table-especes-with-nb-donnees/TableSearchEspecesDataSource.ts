import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { EspeceWithCounts } from "src/app/model/graphql";

export class TableSearchEspecesDataSource implements DataSource<EspeceWithCounts> {

  protected especesSubject = new BehaviorSubject<EspeceWithCounts[]>([]);

  protected countSubject = new BehaviorSubject<number>(0);
  public count$ = this.countSubject.asObservable();

  connect(): Observable<EspeceWithCounts[]> {
    return this.especesSubject.asObservable();
  }

  disconnect(): void {
    this.especesSubject.complete();
    this.countSubject.complete();
  }

  updateValues(newEspeces: EspeceWithCounts[], newCount: number): void {
    this.countSubject.next(newCount);
    this.especesSubject.next(newEspeces);
  }

}