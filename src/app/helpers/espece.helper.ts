import { Espece } from "ouca-common/espece.model";
import { UIEspece } from "../models/espece.model";

export const getEspeceFromUIEspece = (uiEspece: UIEspece): Espece => {
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
