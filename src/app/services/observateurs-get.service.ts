import { Injectable } from "@angular/core";
import { gql, Query } from "apollo-angular";
import { Observateur } from "../model/graphql";

@Injectable({
  providedIn: 'root',
})
export class ObservateursGetService extends Query<{ observateurs: Observateur[] }> {
  document = gql`
    query {
      observateurs {
        id
        libelle
      }
    }
  `;
}