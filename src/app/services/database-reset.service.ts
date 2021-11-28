import { Injectable } from "@angular/core";
import { gql, Mutation } from "apollo-angular";

@Injectable({
  providedIn: 'root',
})
export class DatabaseResetService extends Mutation<{ resetDatabase: boolean }> {
  document = gql`
    mutation ResetDatabase {
      resetDatabase
    }
  `;
}