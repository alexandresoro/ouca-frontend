import { Injectable } from "@angular/core";
import { gql, Query } from "apollo-angular";
import { Version } from '../model/graphql';

@Injectable({
  providedIn: 'root',
})
export class AppVersionGetService extends Query<{ version: Version }> {
  document = gql`
    query GetVersion {
      version {
        database
        application
      }
    }
  `;
}