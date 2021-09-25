import { Injectable } from "@angular/core";
import { gql, Mutation } from "apollo-angular";
import { InputSettings, Settings } from "../model/graphql";

@Injectable({
  providedIn: 'root',
})
export class AppConfigurationUpdateService extends Mutation<{ updateSettings: Settings }, { inputSettings: InputSettings }> {
  document = gql`
    mutation UpdateSettings($inputSettings: InputSettings) {
      updateSettings(appConfiguration: $inputSettings) {
        id
        areAssociesDisplayed
        isMeteoDisplayed
        isDistanceDisplayed
        isRegroupementDisplayed
        defaultAge {
          id
          libelle
        }
        defaultSexe {
          id
          libelle
        }
        defaultNombre
        defaultEstimationNombre {
          id
          libelle
          nonCompte
        }
        coordinatesSystem
        defaultObservateur {
          id
          libelle
        }
        defaultDepartement {
          id
          code
        }
      }
    }
  `;
}