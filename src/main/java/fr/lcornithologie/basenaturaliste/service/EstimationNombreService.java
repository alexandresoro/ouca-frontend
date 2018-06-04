package fr.lcornithologie.basenaturaliste.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.lcornithologie.basenaturaliste.model.EstimationNombre;
import fr.lcornithologie.basenaturaliste.repository.EntiteAvecLibelleRepository;
import fr.lcornithologie.basenaturaliste.repository.EstimationNombreRepository;

@Service
@Transactional
public class EstimationNombreService extends EntiteAvecLibelleService<EstimationNombre> {

    @Autowired
    private EstimationNombreRepository estimationNombreRepository;

    @Override
    protected EntiteAvecLibelleRepository<EstimationNombre> getRepository() {
        return estimationNombreRepository;
    }

    @Override
    protected EstimationNombre getNewObject() {
        return new EstimationNombre();
    }

    @Override
    protected String getEntityName() {
        return EstimationNombre.ENTITY_NAME;
    }

    @Override
    protected String getAlreadyExistsMessage() {
        return "Cette estimation du nombre existe déjà: il existe déjà une estimation du nombre avec ce libellé.";
    }

    @Override
    protected String getCreationSuccessMessage() {
        return "L'estimation du nombre a été créée avec succés.";
    }

    @Override
    protected String getCreationErrorMessage() {
        return "L'estimation du nombre n'a pas pu être créée.";
    }

    @Override
    protected String getUpdateSuccessMessage() {
        return "L'estimation du nombre a été modifiée avec succès.";
    }

    @Override
    protected String getUpdateErrorMessage() {
        return "L'estimation du nombre n'a pas pu être modifiée.";
    }

    @Override
    protected String getRemoveSuccessMessage() {
        return "L'estimation du nombre a été supprimée avec succès.";
    }

    @Override
    protected String getRemoveErrorMessage() {
        return "L'estimation du nombre n'a pas pu être supprimée.";
    }

    @Override
    protected String getDoesNotExistMessage() {
        return "L'estimation du nombre à modifier ou supprimer n'a pas été trouvée.";
    }

    @Override
    protected String getMissingLibelleMessage() {
        return "Aucun libellé n'a été spécifié pour cette estimation du nombre. Veuillez renseigner un libellé pour cette estimation du nombre.";
    }
}
