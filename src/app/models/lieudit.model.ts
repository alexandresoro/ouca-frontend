import { LieuditCommon } from "@ou-ca/ouca-model/lieudit-common.model";
import { UICommune } from "./commune.model";

export interface UILieudit extends LieuditCommon {
  commune: UICommune;
}
