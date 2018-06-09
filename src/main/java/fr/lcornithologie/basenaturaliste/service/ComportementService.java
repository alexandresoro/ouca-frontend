package fr.lcornithologie.basenaturaliste.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import fr.lcornithologie.basenaturaliste.model.Comportement;
import fr.lcornithologie.basenaturaliste.repository.ComportementRepository;

@Service
@Transactional
public class ComportementService extends EntiteAvecLibelleEtCodeService<Comportement> {

    @Autowired
    private ComportementRepository comportementRepository;

    @Override
    protected ComportementRepository getRepository() {
        return comportementRepository;
    }

    @Override
    protected Comportement getNewObject() {
        return new Comportement();
    }

    @Override
    protected String getEntityName() {
        return Comportement.ENTITY_NAME;
    }

    @Override
    protected String getAlreadyExistsMessage() {
        return "Ce comportement existe déjà: il existe déjà un comportement avec ce code ou ce libellé.";
    }

    @Override
    protected String getCreationSuccessMessage() {
        return "Le comportement a été créé avec succès.";
    }

    @Override
    protected String getCreationErrorMessage() {
        return "Le comportement n'a pas pu être créé.";
    }

    @Override
    protected String getUpdateSuccessMessage() {
        return "Le comportement a été modifié avec succès.";
    }

    @Override
    protected String getUpdateErrorMessage() {
        return "Le comportement n'a pas pu être créé.";
    }

    @Override
    protected String getRemoveSuccessMessage() {
        return "Le comportement a été supprimé avec succès.";
    }

    @Override
    protected String getRemoveErrorMessage() {
        return "Le comportement n'a pas pu être supprimé.";
    }

    @Override
    protected String getDoesNotExistMessage() {
        return "Le comportement à modifier ou supprimer n'a pas été trouvé.";
    }

    @Override
    protected String getMissingLibelleMessage() {
        return "Aucun libellé n'a été spécifié pour ce comportement. Veuillez renseigner un libellé pour ce comportement.";
    }

    @Override
    protected String getMissingCodeMessage() {
        return "Aucun code n'a été spécifié pour ce comportement. Veuillez renseigner un code pour ce comportement.";
    }

}
