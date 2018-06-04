package fr.lcornithologie.basenaturaliste.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import fr.lcornithologie.basenaturaliste.model.Departement;
import fr.lcornithologie.basenaturaliste.repository.DepartementRepository;

@Service
@Transactional
public class DepartementService extends EntiteSimpleService<Departement> {

    private final Logger log = LoggerFactory.getLogger(DepartementService.class);

    @Autowired
    private DepartementRepository departementRepository;

    @Override
    protected DepartementRepository getRepository() {
        return departementRepository;
    }

    @Override
    protected Departement getNewObject() {
        return new Departement();
    }

    @Override
    protected String getEntityName() {
        return Departement.ENTITY_NAME;
    }

    @Override
    public List<Departement> findAll() {
        log.info("-- Get all {}", getEntityName());
        return departementRepository.findAllByOrderByCodeAsc();
    }

    @Override
    public Departement update(Departement objectToUpdate) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    protected boolean isNew(Departement departement) {
        Departement existingDepartement = findOneByCode(departement.getCode());
        return isNew(departement, existingDepartement);
    }

    @Override
    protected boolean isValid(Departement departement) {
        return isCodeValid(departement.getCode());
    }

    private boolean isCodeValid(String code) {
        boolean isValid = !StringUtils.isEmpty(code);

        if (!isValid) {
            log.warn("-- Code of Département cannot be null or empty : {}", code);
            addErrorMessage(getMissingCodeDepartement());
        }

        return isValid;
    }

    private Departement findOneByCode(String code) {
        Departement result = null;
        if (code != null) {
            Optional<Departement> entity = getRepository().findOneByCode(code);
            if (entity.isPresent()) {
                result = entity.get();
            }
        }
        return result;
    }

    @Override
    protected String getAlreadyExistsMessage() {
        return "Ce département existe déjà: il existe déjà un département avec ce code.";
    }

    @Override
    protected String getCreationSuccessMessage() {
        return "Le département a été créé avec succès.";
    }

    @Override
    protected String getCreationErrorMessage() {
        return "Le département n'a pas pu être créé.";
    }

    @Override
    protected String getUpdateSuccessMessage() {
        return "Le département a été modifié avec succès.";
    }

    @Override
    protected String getUpdateErrorMessage() {
        return "Le département n'a pas pu être modifié.";
    }

    @Override
    protected String getRemoveSuccessMessage() {
        return "Le département a été supprimé avec succès.";
    }

    @Override
    protected String getRemoveErrorMessage() {
        return "Le département n'a pas pu être supprimé.";
    }

    @Override
    protected String getDoesNotExistMessage() {
        return "Le département à modifier ou supprimer n'a pas été trouvé.";
    }

    private String getMissingCodeDepartement() {
        return "Aucun code n'a été renseigné pour ce département. Veuillez renseigner un code pour le département.";
    }

}
