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
import fr.lcornithologie.basenaturaliste.model.Departement;
import fr.lcornithologie.basenaturaliste.repository.CommuneRepository;

@Service
@Transactional
public class CommuneService extends EntiteSimpleService<Commune> {

	private final Logger log = LoggerFactory.getLogger(CommuneService.class);

	@Autowired
	private CommuneRepository communeRepository;

	@Override
	protected CommuneRepository getRepository() {
		return communeRepository;
	}

	@Override
	protected Commune getNewObject() {
		return new Commune();
	}

	@Override
	protected String getEntityName() {
		return Commune.ENTITY_NAME;
	}

	@Override
	public List<Commune> findAll() {
		log.info("-- Get all {}", getEntityName());
		return communeRepository.findAllByOrderByNomAsc();
	}

	@Override
	protected boolean isNew(Commune commune) {
		boolean isNewObject = true;

		Commune existingCommune = findOneByCodeAndDepartement(commune.getCode(), commune.getDepartement());
		isNewObject = isNew(commune, existingCommune);

		if (isNewObject) {
			existingCommune = findOneByNomAndDepartement(commune.getNom(), commune.getDepartement());
			isNewObject = isNew(commune, existingCommune);
		}

		return isNewObject;

	}

	private Commune findOneByCodeAndDepartement(Integer code, Departement departement) {
		Commune result = null;

		Optional<Commune> entity = communeRepository.findOneByCodeAndDepartement(code, departement);
		if (entity.isPresent()) {
			result = entity.get();
		}

		return result;
	}

	private Commune findOneByNomAndDepartement(String nom, Departement departement) {
		Commune result = null;

		Optional<Commune> entity = communeRepository.findOneByNomAndDepartement(nom, departement);
		if (entity.isPresent()) {
			result = entity.get();
		}

		return result;
	}

	@Override
	protected boolean isValid(Commune commune) {
		return isDepartementValid(commune.getDepartement()) && isCodeValid(commune.getCode())
				&& isNomValid(commune.getNom());
	}

	private boolean isDepartementValid(Departement departement) {
		boolean isValid = departement != null && departement.getId() != null;

		if (!isValid) {
			log.warn("-- Département of Commune cannot be null : {}", departement);
			addErrorMessage(getMissingDepartementMessage());
		}

		return isValid;
	}

	private boolean isCodeValid(Integer code) {
		boolean isValid = code != null;

		if (!isValid) {
			log.warn("-- Code of Commune cannot be null", code);
			addErrorMessage(getMissingCodeCommuneMessage());
		}

		return isValid;
	}

	private boolean isNomValid(String nom) {
		boolean isValid = !StringUtils.isEmpty(nom);

		if (!isValid) {
			log.warn("-- Nom of Commune cannot be null or empty : {}", nom);
			addErrorMessage(getMissingNomCommuneMessage());
		}

		return isValid;
	}

	@Override
	protected String getAlreadyExistsMessage() {
		return "Cette commune existe déjà: dans le département sélectionné, il existe déjà une commune avec ce code ou ce nom.";
	}

	@Override
	protected String getCreationSuccessMessage() {
		return "La communce a été créée avec succès.";
	}

	@Override
	protected String getCreationErrorMessage() {
		return "La commune n'a pas pu être créée.";
	}

	@Override
	protected String getUpdateSuccessMessage() {
		return "La commune a été modifiée avec succès.";
	}

	@Override
	protected String getUpdateErrorMessage() {
		return "La commune n'a pas pu être modifiée.";
	}

	@Override
	protected String getRemoveSuccessMessage() {
		return "La commune a été supprimée avec succès.";
	}

	@Override
	protected String getRemoveErrorMessage() {
		return "La commune n'a pas pu être supprimée.";
	}

	@Override
	protected String getDoesNotExistMessage() {
		return "La commune à modifier ou supprimer n'a pas été trouvée.";
	}

	private String getMissingDepartementMessage() {
		return "Aucun département n'a été spécifié pour cette commune. Veuillez choisir un département existant.";
	}

	private String getMissingCodeCommuneMessage() {
		return "Aucun code n'a été spécifié pour cette commune. Veuillez renseigner un code pour cette commune.";
	}

	private String getMissingNomCommuneMessage() {
		return "Aucun nom n'a été spécifié pour cette commune. Veuillez renseigner un nom pour cette commune.";
	}

}
