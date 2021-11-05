import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { Donnee } from "src/app/model/graphql";

export class TableSearchDonneesDataSource implements DataSource<Donnee> {

  protected donneesSubject = new BehaviorSubject<Donnee[]>([]);

  protected countSubject = new BehaviorSubject<number>(0);
  public count$ = this.countSubject.asObservable();

  connect(): Observable<Donnee[]> {
    return this.donneesSubject.asObservable();
  }

  disconnect(): void {
    this.donneesSubject.complete();
    this.countSubject.complete();
  }

  updateValues(newDonnees: Donnee[], newCount: number): void {
    this.countSubject.next(newCount);
    this.donneesSubject.next(newDonnees);
  }

}