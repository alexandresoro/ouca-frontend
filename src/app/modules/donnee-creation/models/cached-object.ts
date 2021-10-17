// These type represent the model that is used to store the inventaire of a new donnee that is currently edited
// This is used to be able to fill properly the current edition back after we have been navigating to another page
// e.g. edition > previous donnee > back to current

import { Commune, Donnee, Espece, Inventaire, LieuDit } from "src/app/model/graphql";

// We cannot reuse the Inventaire model as is, because the purpose of this object is basically that it is potentially not filled
// like only the department is defined
export type InventaireCachedObject = Partial<Omit<Inventaire, 'id' | 'lieuDit'>> & {
  lieuDit?: Omit<Partial<LieuDit>, 'commune'> & { commune?: Partial<Commune> }
};

// We cannot reuse the Donnee model as is, because the purpose of this object is basically that it is potentially not filled
// like only the classe is defined
export type DonneeCachedObject = Partial<Omit<Donnee, 'id' | 'inventaire' | 'espece'>> & {
  inventaire: InventaireCachedObject
  espece?: Partial<Espece>
  isDonneeEmpty?: boolean; // Used in a very specific case: when the user wants to create a new donnee from an existing inventaire
  // This forces the donnee form to be properly reset
  // TODO check if we can improve this
};