package fr.lcornithologie.basenaturaliste.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import fr.lcornithologie.basenaturaliste.model.Classe;
import fr.lcornithologie.basenaturaliste.model.Espece;
import fr.lcornithologie.basenaturaliste.repository.EspeceRepository;

@Service
@Transactional
public class EspeceService extends EntiteSimpleService<Espece> {

	private final Logger log = LoggerFactory.getLogger(EspeceService.class);

	@Autowired
	private EspeceRepository especeRepository;

	@Override
	protected EspeceRepository getRepository() {
		return especeRepository;
	}

	@Override
	protected Espece getNewObject() {
		return new Espece();
	}

	@Override
	protected String getEntityName() {
		return Espece.ENTITY_NAME;
	}

	@Override
	public List<Espece> findAll() {
		log.info("-- Get all {}", getEntityName());
		return especeRepository.findAllByOrderByCodeAsc();
	}

	@Override
	protected boolean isNew(Espece espece) {
		boolean isNewObject = true;

		Espece existingEspece = findOneByCode(espece.getCode());
		isNewObject = isNew(espece, existingEspece);

		if (isNewObject) {
			existingEspece = findOneByNomFrancais(espece.getNomFrancais());
			isNewObject = isNew(espece, existingEspece);
		}

		return isNewObject;
	}

	@Override
	protected boolean isValid(Espece espece) {
		return isClasseValid(espece.getClasse()) && isCodeValid(espece.getCode())
				&& isNomFrancaisValid(espece.getNomFrancais()) && isNomLatinValid(espece.getNomLatin());
	}

	private boolean isClasseValid(Classe classe) {
		boolean isValid = classe != null && classe.getId() != null;

		if (!isValid) {
			log.warn("-- Classe of Espèce cannot be null : {}", classe);
			addErrorMessage(getMissingClasseMessage());
		}

		return isValid;
	}

	private boolean isCodeValid(String code) {
		boolean isValid = !StringUtils.isEmpty(code);

		if (!isValid) {
			log.warn("-- Code of Espèce cannot be null or empty : {}", code);
			addErrorMessage(getMissingCodeMessage());
		}

		return isValid;
	}

	private boolean isNomFrancaisValid(String nomFrancais) {
		boolean isValid = !StringUtils.isEmpty(nomFrancais);

		if (!isValid) {
			log.warn("-- Nom français of Espèce cannot be null or empty : {}", nomFrancais);
			addErrorMessage(getMissingNomFrancaisMessage());
		}

		return isValid;
	}

	private boolean isNomLatinValid(String nomLatin) {
		boolean isValid = !StringUtils.isEmpty(nomLatin);

		if (!isValid) {
			log.warn("-- Nom latin of Espèce cannot be null or empty : {}", nomLatin);
			addErrorMessage(getMissingNomLatinMessage());
		}

		return isValid;
	}

	private Espece findOneByNomFrancais(String nomFrancais) {
		Espece result = null;

		Optional<Espece> entity = especeRepository.findOneByNomFrancais(nomFrancais);
		if (entity.isPresent()) {
			result = entity.get();
		}

		return result;
	}

	private Espece findOneByCode(String code) {
		Espece result = null;

		Optional<Espece> entity = especeRepository.findOneByCode(code);
		if (entity.isPresent()) {
			result = entity.get();
		}

		return result;
	}

	@Override
	protected String getAlreadyExistsMessage() {
		return "Cette espèce existe déjà: il existe déjà une espèce de cette classe avec ce code, ce nom français ou ce nom latin.";
	}

	@Override
	protected String getCreationSuccessMessage() {
		return "L'espèce a été créée avec succès.";
	}

	@Override
	protected String getCreationErrorMessage() {
		return "L'espèce n'a pas pu être créée.";
	}

	@Override
	protected String getUpdateSuccessMessage() {
		return "L'espèce a été modifiée avec succès.";
	}

	@Override
	protected String getUpdateErrorMessage() {
		return "L'espèce n'a pas pu être modifiée.";
	}

	@Override
	protected String getRemoveSuccessMessage() {
		return "L'espèce a été supprimée avec succès.";
	}

	@Override
	protected String getRemoveErrorMessage() {
		return "L'espèce n'a pas pu être supprimée.";
	}

	@Override
	protected String getDoesNotExistMessage() {
		return "L'espèce à modifier ou supprimer n'a pas été trouvée.";
	}

	private String getMissingClasseMessage() {
		return "Aucune classe n'a été spécifiée pour cette espèce. Veuillez choisir une classe existante.";
	}

	private String getMissingCodeMessage() {
		return "Aucun code n'a été spécifié pour cette espèce. Veuillez renseigner un code pour cette espèce.";
	}

	private String getMissingNomFrancaisMessage() {
		return "Aucun nom français n'a été spécifié pour cette espèce. Veuillez renseigner un nom français pour cette espèce.";
	}

	private String getMissingNomLatinMessage() {
		return "Aucun nom latin n'a été spécifié pour cette espèce. Veuillez renseigner un nom latin pour cette espèce.";
	}
}
