import { Injectable } from "@angular/core";
import { gql, Mutation } from "apollo-angular";

@Injectable({
  providedIn: 'root',
})
export class DatabaseInitializationService extends Mutation<{ initializeDatabase: boolean }> {
  document = gql`
    mutation InitializeDatabase {
      initializeDatabase
    }
  `;
}