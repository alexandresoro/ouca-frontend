import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";

const { setTimeout } = window;

export abstract class EntitesTableDataSource<T> implements DataSource<T> {

  protected entitesSubject = new BehaviorSubject<T[]>([]);

  protected countSubject = new BehaviorSubject<number>(0);
  public count$ = this.countSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();

  private loadingTimeout: number;

  connect(): Observable<T[]> {
    return this.entitesSubject.asObservable();
  }

  disconnect(): void {
    this.entitesSubject.complete();
    this.loadingSubject.complete();
  }

  setLoadingState(): void {
    this.loadingTimeout = setTimeout(() => this.loadingSubject.next(true), 500);
  }

  disableLoadingState(): void {
    clearTimeout(this.loadingTimeout);
    this.loadingSubject.next(false);
  }

}