export const ENTITIES_PROPERTIES: {
  [key: string]: {
    entityName: string;
    anEntityLabel: string;
    theEntityLabel: string;
    theEntityLabelUppercase: string;
    isFeminine: boolean;
  };
} = {
  age: {
    entityName: "age",
    anEntityLabel: "un âge",
    theEntityLabel: "l'âge",
    theEntityLabelUppercase: "L'âge",
    isFeminine: false
  },
  classe: {
    entityName: "classe",
    anEntityLabel: "une classe",
    theEntityLabel: "la classe",
    theEntityLabelUppercase: "La classe",
    isFeminine: true
  },
  commune: {
    entityName: "commune",
    anEntityLabel: "une commune",
    theEntityLabel: "la commune",
    theEntityLabelUppercase: "La commune",
    isFeminine: true
  },
  comportement: {
    entityName: "comportement",
    anEntityLabel: "un comportement",
    theEntityLabel: "le comportement",
    theEntityLabelUppercase: "Le comportement",
    isFeminine: false
  },
  departement: {
    entityName: "departement",
    anEntityLabel: "un département",
    theEntityLabel: "le département",
    theEntityLabelUppercase: "Le département",
    isFeminine: false
  },
  espece: {
    entityName: "espece",
    anEntityLabel: "une espèce",
    theEntityLabel: "l'espèce",
    theEntityLabelUppercase: "L'espèce",
    isFeminine: true
  },
  "estimation-distance": {
    entityName: "estimation-distance",
    anEntityLabel: "une estimation de la distance",
    theEntityLabel: "l'estimation de la distance",
    theEntityLabelUppercase: "L'estimation de la distance",
    isFeminine: true
  },
  "estimation-nombre": {
    entityName: "estimation-nombre",
    anEntityLabel: "une estimation du nombre",
    theEntityLabel: "l'estimation du nombre",
    theEntityLabelUppercase: "L'estimation du nombre",
    isFeminine: true
  },
  lieudit: {
    entityName: "lieudit",
    anEntityLabel: "un lieu-dit",
    theEntityLabel: "le lieu-dit",
    theEntityLabelUppercase: "Le lieu-dit",
    isFeminine: false
  },
  meteo: {
    entityName: "meteo",
    anEntityLabel: "une météo",
    theEntityLabel: "la météo",
    theEntityLabelUppercase: "La météo",
    isFeminine: true
  },
  milieu: {
    entityName: "milieu",
    anEntityLabel: "un milieu",
    theEntityLabel: "le milieu",
    theEntityLabelUppercase: "Le milieu",
    isFeminine: false
  },
  observateur: {
    entityName: "observateur",
    anEntityLabel: "un observateur",
    theEntityLabel: "l'observateur",
    theEntityLabelUppercase: "L'observateur",
    isFeminine: false
  },
  sexe: {
    entityName: "sexe",
    anEntityLabel: "un sexe",
    theEntityLabel: "le sexe",
    theEntityLabelUppercase: "Le sexe",
    isFeminine: false
  }
};
