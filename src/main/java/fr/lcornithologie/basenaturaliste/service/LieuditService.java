package fr.lcornithologie.basenaturaliste.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import fr.lcornithologie.basenaturaliste.model.Commune;
import fr.lcornithologie.basenaturaliste.model.Lieudit;
import fr.lcornithologie.basenaturaliste.repository.LieuditRepository;

@Service
@Transactional
public class LieuditService extends EntiteSimpleService<Lieudit> {

	private final Logger log = LoggerFactory.getLogger(LieuditService.class);

	@Autowired
	private LieuditRepository lieuditRepository;

	@Override
	protected LieuditRepository getRepository() {
		return lieuditRepository;
	}

	@Override
	protected Lieudit getNewObject() {
		return new Lieudit();
	}

	@Override
	protected String getEntityName() {
		return Lieudit.ENTITY_NAME;
	}

	@Override
	public List<Lieudit> findAll() {
		log.info("-- Get all {}", getEntityName());
		return lieuditRepository.findAllByOrderByNomAsc();
	}

	@Override
	public Lieudit create(Lieudit lieuditToCreate) {
		// if (lieuditToCreate != null &&
		// !ModeCreation.TEMPORAIRE.equals(lieuditToCreate.getModeCreation())) {
		// lieuditToCreate.setModeCreation(ModeCreation.NORMAL);
		// }

		return super.create(lieuditToCreate);
	}

	@Override
	protected boolean isValid(Lieudit lieudit) {
		return isCommuneValid(lieudit.getCommune()) && isNomValid(lieudit.getNom())
				&& isAltitudeValid(lieudit.getAltitude()) && isLongitudeValid(lieudit.getLongitude())
				&& isLatitudeValid(lieudit.getLatitude());
	}

	private boolean isCommuneValid(Commune commune) {
		boolean isValid = commune != null && commune.getId() != null;

		if (!isValid) {
			log.error("-- Commune of Lieu-dit cannot be null");
			addErrorMessage(getMissingCommuneMessage());
		}

		return isValid;
	}

	private boolean isNomValid(String nom) {
		boolean isValid = !StringUtils.isEmpty(nom);

		if (!isValid) {
			log.error("-- Nom of Lieu-dit cannot be null");
			addErrorMessage(getMissingNomMessage());
		}

		return isValid;
	}

	// TODO > 0 or not
	private boolean isLongitudeValid(long longitude) {
		return true;
	}

	private boolean isLatitudeValid(long latitude) {
		return true;
	}

	private boolean isAltitudeValid(long altitude) {
		return true;
	}

	@Override
	protected boolean isNew(Lieudit lieudit) {
		boolean isNewObject = true;

		// When mode creation = temporaire then we consider it is new by default
		// if (!ModeCreation.TEMPORAIRE.equals(lieudit.getModeCreation())) {
		// Lieudit existingLieudit = findOneNormalByNomAndCommune(lieudit);
		// isNewObject = isNew(lieudit, existingLieudit);
		// }

		return isNewObject;
	}

	private Lieudit findOneNormalByNomAndCommune(Lieudit lieudit) {
		Lieudit result = null;
		if (lieudit != null) {
			Optional<Lieudit> entity = lieuditRepository.findOneByNomAndCommune(lieudit.getNom(), lieudit.getCommune());
			if (entity.isPresent()) {
				result = entity.get();
			}
		}
		return result;
	}

	@Override
	protected String getAlreadyExistsMessage() {
		return "Ce lieu-dit existe déjà: il existe déjà un lieu-dit dans cette commune avec le même nom.";
	}

	@Override
	protected String getCreationSuccessMessage() {
		return "Le lieu-dit a été créé avec succès.";
	}

	@Override
	protected String getCreationErrorMessage() {
		return "Le lieu-dit n'a pas pu être créé.";
	}

	@Override
	protected String getUpdateSuccessMessage() {
		return "Le lieu-dit a été modifié avec succès.";
	}

	@Override
	protected String getUpdateErrorMessage() {
		return "Le lieu-dit n'a pas pu être modifié.";
	}

	@Override
	protected String getRemoveSuccessMessage() {
		return "Le lieu-dit a été supprimé avec succès.";
	}

	@Override
	protected String getRemoveErrorMessage() {
		return "Le lieu-dit n'a pas pu être supprimé.";
	}

	@Override
	protected String getDoesNotExistMessage() {
		return "Le lieu-dit à modifier ou supprimer n'a pas été trouvé.";
	}

	protected String getMissingCommuneMessage() {
		return "Aucune commune n'a été spécifié pour ce lieu-dit. Veuillez choisir une commune existante.";
	}

	protected String getMissingNomMessage() {
		return "Aucun nom n'a été spécifié pour ce lieu-dit. Veuillez renseigner un nom pour ce lieu-dit.";
	}

}
