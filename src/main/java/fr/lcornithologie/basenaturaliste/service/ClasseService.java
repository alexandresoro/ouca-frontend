package fr.lcornithologie.basenaturaliste.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.lcornithologie.basenaturaliste.model.Classe;
import fr.lcornithologie.basenaturaliste.repository.ClasseRepository;

@Service
@Transactional
public class ClasseService extends EntiteAvecLibelleService<Classe> {

    @Autowired
    private ClasseRepository classeRepository;

    @Override
    protected ClasseRepository getRepository() {
        return classeRepository;
    }

    @Override
    protected Classe getNewObject() {
        return new Classe();
    }

    @Override
    protected String getEntityName() {
        return Classe.ENTITY_NAME;
    }

    @Override
    protected String getAlreadyExistsMessage() {
        return "Cette classe existe déjà: il existe déjà une classe avec ce libellé.";
    }

    @Override
    protected String getCreationSuccessMessage() {
        return "La classe a été créée avec succès.";
    }

    @Override
    protected String getCreationErrorMessage() {
        return "La classe n'a pas pu être créée.";
    }

    @Override
    protected String getUpdateSuccessMessage() {
        return "La classe a été modifiée avec succès.";
    }

    @Override
    protected String getUpdateErrorMessage() {
        return "La classe n'a pas pu être modifiée.";
    }

    @Override
    protected String getRemoveSuccessMessage() {
        return "La classe a été supprimée avec succès.";
    }

    @Override
    protected String getRemoveErrorMessage() {
        return "La classe n'a pas pu être supprimée.";
    }

    @Override
    protected String getDoesNotExistMessage() {
        return "La classe à modifier ou supprimer n'a pas été trouvée.";
    }

    @Override
    protected String getMissingLibelleMessage() {
        return "Aucun libellé n'a été spécifié pour cette classe. Veuillez renseigner un libellé pour cette classe.";
    }
}
