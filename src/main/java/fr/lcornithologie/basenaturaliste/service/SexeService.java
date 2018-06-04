package fr.lcornithologie.basenaturaliste.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.lcornithologie.basenaturaliste.model.Sexe;
import fr.lcornithologie.basenaturaliste.repository.EntiteAvecLibelleRepository;
import fr.lcornithologie.basenaturaliste.repository.SexeRepository;

@Service
@Transactional
public class SexeService extends EntiteAvecLibelleService<Sexe> {

    @Autowired
    private SexeRepository sexeRepository;

    @Override
    protected EntiteAvecLibelleRepository<Sexe> getRepository() {
        return sexeRepository;
    }

    @Override
    protected Sexe getNewObject() {
        return new Sexe();
    }

    @Override
    protected String getEntityName() {
        return Sexe.ENTITY_NAME;
    }

    @Override
    protected String getAlreadyExistsMessage() {
        return "Ce sexe existe déjà: il existe déjà un sexe avec ce libellé.";
    }

    @Override
    protected String getCreationSuccessMessage() {
        return "Le sexe a été créé avec succès.";
    }

    @Override
    protected String getCreationErrorMessage() {
        return "Le sexe n'a pas pu être créé.";
    }

    @Override
    protected String getUpdateSuccessMessage() {
        return "Le sexe a été modifié avec succès.";
    }

    @Override
    protected String getUpdateErrorMessage() {
        return "Le sexe n'a pas pu être modifié.";
    }

    @Override
    protected String getRemoveSuccessMessage() {
        return "Le sexe a été supprimé avec succès.";
    }

    @Override
    protected String getRemoveErrorMessage() {
        return "Le sexe n'a pas pu être supprimé.";
    }

    @Override
    protected String getDoesNotExistMessage() {
        return "Le sexe à modifier ou supprimer n'a pas été trouvé.";
    }

    @Override
    protected String getMissingLibelleMessage() {
        return "Aucun libellé n'a été spécifié pour ce sexe. Veuillez renseigner un libellé pour ce sexe.";
    }
}
