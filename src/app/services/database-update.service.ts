import { Injectable } from "@angular/core";
import { gql, Mutation } from "apollo-angular";

@Injectable({
  providedIn: 'root',
})
export class DatabaseUpdateService extends Mutation<{ updateDatabase: boolean }> {
  document = gql`
    mutation UpdateDatabase {
      updateDatabase
    }
  `;
}