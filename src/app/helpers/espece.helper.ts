import { Espece } from "@ou-ca/ouca-model";
import { UIEspece } from "../models/espece.model";

export const buildEspeceFromUIEspece = (uiEspece: UIEspece): Espece => {
  let espece: Espece = null;
  if (uiEspece?.classe) {
    const { classe, ...especeAttributes } = uiEspece;
    espece = {
      ...especeAttributes,
      classeId: classe.id
    };
  }

  return espece;
};
