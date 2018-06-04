package fr.lcornithologie.basenaturaliste.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.lcornithologie.basenaturaliste.model.Observateur;
import fr.lcornithologie.basenaturaliste.repository.EntiteAvecLibelleRepository;
import fr.lcornithologie.basenaturaliste.repository.ObservateurRepository;

@Service
@Transactional
public class ObservateurService extends EntiteAvecLibelleService<Observateur> {

    @Autowired
    private ObservateurRepository observateurRepository;

    @Override
    protected EntiteAvecLibelleRepository<Observateur> getRepository() {
        return observateurRepository;
    }

    @Override
    protected Observateur getNewObject() {
        return new Observateur();
    }

    @Override
    protected String getEntityName() {
        return Observateur.ENTITY_NAME;
    }

    @Override
    protected String getAlreadyExistsMessage() {
        return "Cet observateur existe déjà: il existe déjà un observateur avec ce nom.";
    }

    @Override
    protected String getCreationSuccessMessage() {
        return "L'observateur a été créé avec succès.";
    }

    @Override
    protected String getCreationErrorMessage() {
        return "L'observateur n'a pas pu être créé.";
    }

    @Override
    protected String getUpdateSuccessMessage() {
        return "L'observateur a été modifié avec succès.";
    }

    @Override
    protected String getUpdateErrorMessage() {
        return "L'observateur n'a pas pu être modifié.";
    }

    @Override
    protected String getRemoveSuccessMessage() {
        return "L'observateur a été supprimé avec succès.";
    }

    @Override
    protected String getRemoveErrorMessage() {
        return "L'observateur n'a pas pu être supprimé.";
    }

    @Override
    protected String getDoesNotExistMessage() {
        return "L'observateur à modifier ou supprimer n'a pas été trouvé.";
    }

    @Override
    protected String getMissingLibelleMessage() {
        return "Aucun nom n'a été spécifié pour cet observateur. Veuillez renseigner un nom pour cet observateur.";
    }
}
