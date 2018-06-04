package fr.lcornithologie.basenaturaliste.service;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.lcornithologie.basenaturaliste.model.Inventaire;
import fr.lcornithologie.basenaturaliste.model.Lieudit;
import fr.lcornithologie.basenaturaliste.model.Meteo;
import fr.lcornithologie.basenaturaliste.model.Observateur;
import fr.lcornithologie.basenaturaliste.repository.InventaireRepository;
import helper.TimeFormatHelper;

@Service
@Transactional
public class InventaireService extends EntiteSimpleService<Inventaire> {

	private static String OBSERVATEUR = "Observateur";

	private static String ASSOCIE = "Associé";

	private final Logger log = LoggerFactory.getLogger(InventaireService.class);

	@Autowired
	private InventaireRepository inventaireRepository;

	@Autowired
	private LieuditService lieuditService;

	@Override
	protected InventaireRepository getRepository() {
		return inventaireRepository;
	}

	@Override
	protected Inventaire getNewObject() {
		return new Inventaire();
	}

	@Override
	protected String getEntityName() {
		return Inventaire.ENTITY_NAME;
	}

	@Override
	public Inventaire create(Inventaire inventaireToCreate) {
		Inventaire createdInventaire = null;

		if (inventaireToCreate != null) {
			// Check if lieudit has been modified
			Lieudit lieudit = inventaireToCreate.getLieudit();
			if (lieudit != null && lieudit.getId() == null) {
				// lieudit.setModeCreation(ModeCreation.TEMPORAIRE); // TODO
				inventaireToCreate.setLieudit(lieuditService.create(lieudit));
			}

			inventaireToCreate.setDateCreation(new Timestamp(System.currentTimeMillis()));
			inventaireToCreate.setDate(new Date(System.currentTimeMillis()));// TODO
			// fix
			// this
			createdInventaire = super.create(inventaireToCreate);

		}

		return createdInventaire;
	}

	@Override
	public Inventaire update(Inventaire inventaireToUpdate) {
		Inventaire updatedInventaire = null;

		if (inventaireToUpdate != null) {

			Lieudit lieudit = inventaireToUpdate.getLieudit();
			if (lieudit != null && lieudit.getId() == null) {
				// lieudit.setModeCreation(ModeCreation.TEMPORAIRE); //TODO
				inventaireToUpdate.setLieudit(lieuditService.create(lieudit));

			} else if (lieudit != null && lieudit.getId() != null) {
				// && ModeCreation.TEMPORAIRE.equals(lieudit.getModeCreation()))
				// {
				inventaireToUpdate.setLieudit(lieuditService.update(lieudit));
			}

			updatedInventaire = super.update(inventaireToUpdate);
		}

		return updatedInventaire;
	}

	// TODO verifier que les données sont supprimées
	@Override
	public boolean delete(Long id) {
		Inventaire inventaire = inventaireRepository.findOne(id);

		boolean isLieuditDeleted = super.delete(id);

		if (isLieuditDeleted) {
			// If it is a temporary lieu-dit we can remove it
			if (inventaire != null) {
				// &&
				// ModeCreation.TEMPORAIRE.equals(inventaire.getLieudit().getModeCreation()))
				// {
			}
			lieuditService.delete(inventaire.getLieudit().getId());
		}

		return isLieuditDeleted;

	}

	@Override
	protected boolean isValid(Inventaire inventaire) {
		return isObservateurValid(inventaire.getObservateur(), OBSERVATEUR)
				&& areAssociesValid(inventaire.getAssocies()) && isDateValid(inventaire.getDate())
				&& isHeureValid(inventaire.getHeure()) && isDureeValid(inventaire.getDuree())
				&& isLieuditValid(inventaire.getLieudit()) && isTemperatureValid(inventaire.getTemperature())
				&& areMeteosValid(inventaire.getMeteos());
	}

	private boolean isObservateurValid(Observateur observateur, String type) {
		boolean isValid = observateur != null && observateur.getId() != null;

		if (!isValid) {
			log.error("-- {0} of Inventaire cannot be null", type);

			if (OBSERVATEUR.equals(type)) {
				addErrorMessage(getMissingObservateurMessage());
			} else if (ASSOCIE.equals(type)) {
				addErrorMessage(getMissingAssocieMessage());
			}
		}

		return isValid;
	}

	private boolean areAssociesValid(Set<Observateur> associes) {
		boolean areAssociesValid = true;

		for (Observateur associe : associes) {
			if (areAssociesValid && !isObservateurValid(associe, ASSOCIE)) {
				areAssociesValid = false;
			}
		}

		return areAssociesValid;
	}

	private boolean isDateValid(Date date) {
		boolean isValid = date != null;

		if (!isValid) {
			log.error("-- Date of Inventaire cannot be null");
			addErrorMessage(getMissingDateMessage());
			isValid = false;
		}

		return isValid;
	}

	private boolean isHeureFormatValid(String heure) {
		TimeFormatHelper timeFormatHelper = new TimeFormatHelper();
		return timeFormatHelper.validate(heure);
	}

	private boolean isHeureValid(String heure) {
		boolean isValid = heure == null || isHeureFormatValid(heure);

		if (!isValid) {
			log.error("-- Heure of Inventaire is invalid : {0}", heure);
			addErrorMessage(getInvalidHeureMessage());
			isValid = false;
		}

		return isValid;
	}

	private boolean isDureeValid(String duree) {
		boolean isValid = duree == null || isHeureFormatValid(duree);

		if (!isValid) {
			log.error("-- Durée of Inventaire is invalid : {0}", duree);
			addErrorMessage(getInvalidDureeMessage());
			isValid = false;
		}

		return isValid;
	}

	private boolean isLieuditValid(Lieudit lieudit) {
		boolean isValid = lieudit != null && lieudit.getId() != null;

		if (!isValid) {
			log.error("-- Lieu-dit of Inventaire cannot be null and its ID cannot be null");
			addErrorMessage(getMissingLieuditMessage());
		}

		return isValid;
	}

	// Can be Null or an Integer
	private boolean isTemperatureValid(Integer temperature) {
		return true;
	}

	private boolean areMeteosValid(Set<Meteo> meteos) {
		boolean areMeteosValid = true;

		for (Meteo meteo : meteos) {
			if (areMeteosValid && (meteo == null || meteo.getId() == null)) {
				log.error("-- Météo of Inventaire cannot be null");
				addErrorMessage(getMissingMeteoMessage());
				areMeteosValid = false;
			}
		}

		return areMeteosValid;
	}

	@Override
	protected boolean isNew(Inventaire object) {
		// There is no check on Inventaire creation
		return true;
	}

	@Override
	protected String getAlreadyExistsMessage() {
		return "Cet inventaire existe déjà.";
	}

	@Override
	protected String getCreationSuccessMessage() {
		return "L'inventaire a été créé avec succès.";
	}

	@Override
	protected String getCreationErrorMessage() {
		return "L'inventaire n'a pas pu être créé.";
	}

	@Override
	protected String getUpdateSuccessMessage() {
		return "L'inventaire a été modifié avec succès.";
	}

	@Override
	protected String getUpdateErrorMessage() {
		return "L'inventaire n'a pas pu être modifié.";
	}

	@Override
	protected String getRemoveSuccessMessage() {
		return "L'inventaire a été supprimé avec succès.";
	}

	@Override
	protected String getRemoveErrorMessage() {
		return "L'inventaire n'a pas pu être supprimé.";
	}

	@Override
	protected String getDoesNotExistMessage() {
		return "L'inventaire à modifier ou supprimer n'a pas été trouvé.";
	}

	private String getMissingObservateurMessage() {
		return "Aucun obervateur n'a été spécifié pour cet inventaire. Veuillez choisir un observateur existant.";
	}

	private String getMissingAssocieMessage() {
		return "Un des observateurs associés sélectionnés ne peut pas être trouvé. Veuillez choisir un observateur existant.";
	}

	private String getMissingDateMessage() {
		return "Aucune date n'a été spécifiée pour cet inventaire. Veuillez renseigner une date pour cet inventaire.";
	}

	private String getInvalidHeureMessage() {
		return "Le format de l'heure de cet inventaire est incorrect. Veuillez vérifier la valeur renseignée.";
	}

	private String getInvalidDureeMessage() {
		return "Le format de la durée de cet inventaire est incorrect. Veuillez vérifier la valeur renseignée.";
	}

	private String getMissingLieuditMessage() {
		return "Aucun lieu-dit n'a été spécifié pour cet inventaire. Veuillez choisir un lieu-dit existant.";
	}

	private String getMissingMeteoMessage() {
		return "Une des météos sélectionnées ne peut pas être trouvée. Veuillez choisir une météo existante.";
	}
}
