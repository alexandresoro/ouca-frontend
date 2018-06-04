package fr.lcornithologie.basenaturaliste.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.lcornithologie.basenaturaliste.model.EntiteSimple;
import fr.lcornithologie.basenaturaliste.page.UserMessage;
import fr.lcornithologie.basenaturaliste.repository.EntiteSimpleRepository;

@Service
@Transactional
public abstract class EntiteSimpleService<T extends EntiteSimple> {

	protected final Logger log = LoggerFactory.getLogger(EntiteSimpleService.class);

	List<UserMessage> messages = new ArrayList<>();

	private TypeMessage status;

	protected abstract String getEntityName();

	protected abstract String getAlreadyExistsMessage();

	protected abstract String getCreationSuccessMessage();

	protected abstract String getCreationErrorMessage();

	protected abstract String getUpdateSuccessMessage();

	protected abstract String getUpdateErrorMessage();

	protected abstract String getRemoveSuccessMessage();

	protected abstract String getRemoveErrorMessage();

	protected abstract String getDoesNotExistMessage();

	protected abstract EntiteSimpleRepository<T> getRepository();

	protected abstract T getNewObject();

	public T create(T objectToSave) {
		clearMessages();

		log.info("-- Start creating object {} = {}", getEntityName(), objectToSave);

		T createdObject = null;
		if (isValidForCreation(objectToSave)) {

			createdObject = getRepository().save(objectToSave);

			if (createdObject != null) {
				addSuccessMessage(getCreationSuccessMessage());
				log.info("-- Object {} has been created : {}", getEntityName(), createdObject);
			} else {
				addErrorMessage(getCreationErrorMessage());
				log.error("-- Object {} cannot created : {}", getEntityName(), objectToSave);
			}
		}

		log.info("-- End of creation of {} = {}. Status = {}", getEntityName(), objectToSave, this.status);

		return createdObject;
	}

	public T update(T objectToUpdate) {
		clearMessages();

		log.info("-- Start updating {} = {}", getEntityName(), objectToUpdate);

		T updatedObject = null;
		if (isValidForUpdate(objectToUpdate)) {

			updatedObject = getRepository().save(objectToUpdate);

			if (updatedObject != null) {
				addSuccessMessage(getUpdateSuccessMessage());
				log.info("-- Object {} has been updated : {}", getEntityName(), updatedObject);
			} else {
				addErrorMessage(getUpdateErrorMessage());
				log.error("-- An error has occured. Object {} cannot be updated : {}", getEntityName(), objectToUpdate);
			}
		}

		log.info("-- End of update of {} = {}. Status = {}", getEntityName(), objectToUpdate, this.status);

		return updatedObject;
	}

	public boolean delete(Long id) {
		clearMessages();

		boolean result = false;

		log.info("-- Start removing {} with ID = {}", getEntityName(), id);

		if (id == null) {
			addErrorMessage(getDoesNotExistMessage());
			log.warn("The ID of the {} to delete is null");
		} else {
			T objectToDelete = findById(id);
			if (objectToDelete != null) {
				getRepository().delete(id);
				T deletedObject = findById(id);
				if (deletedObject == null) {
					addSuccessMessage(getRemoveSuccessMessage());
					log.info("Le comportement avec ID = {} a été supprimé", id);
					result = true;
				} else {
					addErrorMessage(getRemoveErrorMessage());
					log.error("The {} with ID = {} can't be deleted", getEntityName(), id);
				}
			}
		}

		log.info("-- End of removal of {} with ID = {}. Status = {}", getEntityName(), id, this.status);

		return result;
	}

	public T findById(Long id) {
		log.info("-- Get {} with ID={}", getEntityName(), id);
		T object = null;
		if (id != null) {
			object = getRepository().findOne(id);
		}
		log.info("-- {} with ID={} : {}", getEntityName(), id, object);
		return object;
	}

	public List<T> findAll() {
		log.info("-- Get all {}", getEntityName());
		return getRepository().findAll();
	}

	protected boolean isValidForCreation(T object) {
		return object != null && isValid(object) && isNew(object);
	}

	protected boolean isValidForUpdate(T object) {
		return isExisting(object) && isValid(object) && isNew(object);
	}

	protected abstract boolean isNew(T object);

	protected abstract boolean isValid(T object);

	private boolean isExisting(T object) {
		boolean isNotExisting = object == null || object.getId() == null
				|| getRepository().getOne(object.getId()) == null;

		if (isNotExisting) {
			addErrorMessage(getDoesNotExistMessage());
			log.info("The {} does not exists : {}", getEntityName(), object);
		}

		return !isNotExisting;
	}

	protected boolean isNew(T object, T existingObject) {
		boolean isNewObject = true;

		if (existingObject != null) {
			if (object.getId() != null) {
				isNewObject = object.getId() == existingObject.getId();
			} else {
				isNewObject = false;
			}
		}

		if (!isNewObject) {
			addErrorMessage(getAlreadyExistsMessage());
			log.info("The {} already exists : {}", getEntityName(), object);
		}

		return isNewObject;
	}

	public TypeMessage getStatus() {
		return status;
	}

	public void setStatus(TypeMessage status) {
		this.status = status;
	}

	private void addMessage(String message, TypeMessage type) {
		messages.add(new UserMessage(message, type));
		this.status = type;
	}

	public void addSuccessMessage(String message) {
		addMessage(message, TypeMessage.SUCCESS);
	}

	public void addErrorMessage(String message) {
		addMessage(message, TypeMessage.ERROR);
	}

	public void addInfoMessage(String message) {
		addMessage(message, TypeMessage.INFO);
	}

	public List<UserMessage> getMessages() {
		return messages;
	}

	public void clearMessages() {
		messages.clear();
		log.info(Messages.FIRST_LINE);
	}

	public boolean noMessages() {
		return messages.isEmpty();
	}
}