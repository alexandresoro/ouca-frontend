package fr.lcornithologie.basenaturaliste.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.lcornithologie.basenaturaliste.model.Age;
import fr.lcornithologie.basenaturaliste.repository.AgeRepository;

@Service
@Transactional
public class AgeService extends EntiteAvecLibelleService<Age> {

    @Autowired
    private AgeRepository ageRepository;

    @Override
    protected AgeRepository getRepository() {
        return ageRepository;
    }

    @Override
    protected Age getNewObject() {
        return new Age();
    }

    @Override
    protected String getEntityName() {
        return Age.ENTITY_NAME;
    }

    public Age getAgeById(long id) {
        return ageRepository.getOne(id);
    }

    @Override
    protected String getAlreadyExistsMessage() {
        return "Cet âge existe déjà: il existe déjà un âge avec ce libellé.";
    }

    @Override
    protected String getCreationSuccessMessage() {
        return "L'âge a été créé avec succès.";
    }

    @Override
    protected String getCreationErrorMessage() {
        return "L'âge n'a pas pu être créé.";
    }

    @Override
    protected String getUpdateSuccessMessage() {
        return "L'âge a été modifié avec succès.";
    }

    @Override
    protected String getUpdateErrorMessage() {
        return "L'âge n'a pas pu être modifié.";
    }

    @Override
    protected String getRemoveSuccessMessage() {
        return "L'âge a bien été supprimé.";
    }

    @Override
    protected String getRemoveErrorMessage() {
        return "L'âge n'a pas pu être supprimé.";
    }

    @Override
    protected String getDoesNotExistMessage() {
        return "L'âge à modifier ou à supprimer n'a pas été trouvé.";
    }

    @Override
    protected String getMissingLibelleMessage() {
        return "Aucun libellé n'a été spécifié pour cet âge. Veuillez renseigner un libellé pour cet âge.";
    }

}
