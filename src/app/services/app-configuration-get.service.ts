import { Injectable } from '@angular/core';
import { gql, Query } from 'apollo-angular';
import { Settings } from '../model/graphql';

@Injectable({
  providedIn: 'root',
})
export class AppConfigurationGetService extends Query<{ settings: Settings }> {
  document = gql`
    query GetSettings {
      settings {
        id
        areAssociesDisplayed
        isDistanceDisplayed
        isMeteoDisplayed
        isRegroupementDisplayed
        defaultDepartement {
          id
          code
        }
        defaultObservateur {
          id
          libelle
        }
        coordinatesSystem
        defaultEstimationNombre {
          id
          libelle
          nonCompte
        }
        defaultSexe {
          id
          libelle
        }
        defaultAge {
          id
          libelle
        }
        defaultNombre
      }
    }
  `;
}