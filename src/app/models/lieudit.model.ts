import { LieuditCommon } from "@ou-ca/ouca-model";
import { UICommune } from "./commune.model";

export interface UILieudit extends LieuditCommon {
  commune: UICommune;
}
