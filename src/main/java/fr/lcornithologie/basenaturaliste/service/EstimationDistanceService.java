package fr.lcornithologie.basenaturaliste.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.lcornithologie.basenaturaliste.model.EstimationDistance;
import fr.lcornithologie.basenaturaliste.repository.EntiteAvecLibelleRepository;
import fr.lcornithologie.basenaturaliste.repository.EstimationDistanceRepository;

@Service
@Transactional
public class EstimationDistanceService extends EntiteAvecLibelleService<EstimationDistance> {

    private static String ENTITY_NAME = "estimationDistance";

    @Autowired
    private EstimationDistanceRepository estimationDistanceRepository;

    @Override
    protected EntiteAvecLibelleRepository<EstimationDistance> getRepository() {
        return estimationDistanceRepository;
    }

    @Override
    protected EstimationDistance getNewObject() {
        return new EstimationDistance();
    }

    @Override
    protected String getEntityName() {
        return ENTITY_NAME;
    }

    @Override
    protected String getAlreadyExistsMessage() {
        return "Cette estimation de distance existe déjà: il existe déjà une estimation de distance avec ce libellé.";
    }

    @Override
    protected String getCreationSuccessMessage() {
        return "L'estimation de distance a été créée avec succés.";
    }

    @Override
    protected String getCreationErrorMessage() {
        return "L'estimation de distance n'a pas pu être créée.";
    }

    @Override
    protected String getUpdateSuccessMessage() {
        return "L'estimation de distance a été modifiée avec succès.";
    }

    @Override
    protected String getUpdateErrorMessage() {
        return "L'estimation de distance n'a pas pu être modifiée.";
    }

    @Override
    protected String getRemoveSuccessMessage() {
        return "L'estimation de distance a été supprimée avec succès.";
    }

    @Override
    protected String getRemoveErrorMessage() {
        return "L'estimation de distance n'a pas pu être supprimée.";
    }

    @Override
    protected String getDoesNotExistMessage() {
        return "L'estimation de distance à modifier ou supprimer n'a pas été trouvée.";
    }

    @Override
    protected String getMissingLibelleMessage() {
        return "Aucun libellé n'a été spécifié pour cette estimation de distance. Veuillez renseigner un libellé pour cette estimation de distance.";
    }

}
