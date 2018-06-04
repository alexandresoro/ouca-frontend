package fr.lcornithologie.basenaturaliste.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import fr.lcornithologie.basenaturaliste.model.EntiteAvecLibelleEtCode;
import fr.lcornithologie.basenaturaliste.repository.EntiteAvecLibelleEtCodeRepository;

@Service
@Transactional
public abstract class EntiteAvecLibelleEtCodeService<T extends EntiteAvecLibelleEtCode> extends EntiteSimpleService<T> {

	private final Logger log = LoggerFactory.getLogger(EntiteAvecLibelleEtCodeService.class);

	@Override
	protected abstract EntiteAvecLibelleEtCodeRepository<T> getRepository();

	protected abstract String getMissingLibelleMessage();

	protected abstract String getMissingCodeMessage();

	/**
	 * Find all objects
	 *
	 * @return
	 */
	@Override
	public List<T> findAll() {
		log.info("-- Get all {} ordered by Code ASC", getEntityName());
		return getRepository().findAllByOrderByLibelleAsc();
	}

	@Override
	protected boolean isValid(T object) {
		return isLibelleValid(object.getLibelle()) && isCodeValid(object.getCode());
	}

	private boolean isLibelleValid(String libelle) {
		boolean isValid = !StringUtils.isEmpty(libelle);

		if (!isValid) {
			log.warn("-- Libelle of {0} cannot be null or empty : {1}", this.getEntityName(), libelle);
			addErrorMessage(getMissingLibelleMessage());
		}

		return isValid;
	}

	private boolean isCodeValid(String code) {
		boolean isValid = !StringUtils.isEmpty(code);

		if (!isValid) {
			log.warn("-- Code of {0} cannot be null or empty : {1}", this.getEntityName(), code);
			addErrorMessage(getMissingCodeMessage());
		}

		return isValid;
	}

	@Override
	protected boolean isNew(T object) {
		boolean isNewObject = true;

		T existingObject = findOneByCode(object.getCode());
		isNewObject = isNew(object, existingObject);

		if (isNewObject) {
			existingObject = findOneByLibelle(object.getLibelle());
			isNewObject = isNew(object, existingObject);
		}

		return isNewObject;
	}

	public T findByCodeAndLibelle(String code, String libelle) {
		log.info("-- Get {} with Code = {} and Libellé = {}", code, libelle);

		T result = null;
		Optional<T> object = getRepository().findOneByCodeAndLibelle(code, libelle);
		if (object.isPresent()) {
			result = object.get();
		}

		log.info("Returned {} searched by Code = {} and Libellé = {} : {}", code, libelle, result);

		return result;
	}

	public T findOneByCode(String code) {
		log.info("-- Get {} with Code = {}", code);

		T result = null;
		Optional<T> object = getRepository().findOneByCode(code);
		if (object.isPresent()) {
			result = object.get();
		}

		log.info("Returned {} searched by Code = {} : {}", code, result);

		return result;
	}

	public T findOneByLibelle(String libelle) {
		log.info("-- Get {} with Libellé = {}", libelle);

		T result = null;
		Optional<T> object = getRepository().findOneByLibelle(libelle);
		if (object.isPresent()) {
			result = object.get();
		}

		log.info("Returned {} searched by Libellé = {} : {}", libelle, result);

		return result;
	}

}
