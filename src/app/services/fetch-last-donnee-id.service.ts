import { Injectable } from '@angular/core';
import { gql, Query } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class FetchLastDonneeIdService extends Query<{ lastDonneeId: number }> {
  document = gql`
    query {
      lastDonneeId
    }
  `;
}