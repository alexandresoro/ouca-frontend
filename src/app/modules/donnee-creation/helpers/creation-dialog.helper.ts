import { ConfirmationDialogData } from "../../shared/components/confirmation-dialog/confirmation-dialog-data.object";
import { MultipleOptionsDialogData } from "../../shared/components/multiple-options-dialog/multiple-options-dialog-data.object";

export const getUpdateInventaireDialogData = (
  allDonneesOption: number,
  onlyCurrentDonneeOption: number
): MultipleOptionsDialogData => {
  return {
    title: "Confirmation de mise-à-jour",
    content:
      "Vous avez modifié la fiche inventaire. " +
      "Voulez-vous mettre à jour la fiche inventaire pour cette fiche espèce " +
      "seulement ou pour toutes les fiches espèces de cette fiche inventaire ?",
    options: [
      {
        value: allDonneesOption,
        label: "Pour toutes les fiches espèces de cette fiche inventaire",
        color: "primary",
      },
      {
        value: onlyCurrentDonneeOption,
        label: "Pour cette fiche espèce seulement",
        color: "primary",
      },
      { label: "Annuler", color: "accent" },
    ],
  };
};

export const getDeleteDonneeDialogData = (): ConfirmationDialogData => {
  return new ConfirmationDialogData(
    "Confirmation de suppression",
    "Êtes-vous certain de vouloir supprimer cette fiche espèce ?",
    "Oui, supprimer",
    "Non, annuler"
  );
};
