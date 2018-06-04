package fr.lcornithologie.basenaturaliste.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.lcornithologie.basenaturaliste.model.Meteo;
import fr.lcornithologie.basenaturaliste.repository.EntiteAvecLibelleRepository;
import fr.lcornithologie.basenaturaliste.repository.MeteoRepository;

@Service
@Transactional
public class MeteoService extends EntiteAvecLibelleService<Meteo> {

    @Autowired
    private MeteoRepository meteoRepository;

    @Override
    protected EntiteAvecLibelleRepository<Meteo> getRepository() {
        return meteoRepository;
    }

    @Override
    protected Meteo getNewObject() {
        return new Meteo();
    }

    @Override
    protected String getEntityName() {
        return Meteo.ENTITY_NAME;
    }

    @Override
    protected String getAlreadyExistsMessage() {
        return "Cette météo existe déjà: il existe déjà une météo avec ce libellé.";
    }

    @Override
    protected String getCreationSuccessMessage() {
        return "La météo a été créée avec succès.";
    }

    @Override
    protected String getCreationErrorMessage() {
        return "La météo n'a pas pu être créée.";
    }

    @Override
    protected String getUpdateSuccessMessage() {
        return "La météo a été modifiée avec succès.";
    }

    @Override
    protected String getUpdateErrorMessage() {
        return "La météo n'a pas pu être modifiée.";
    }

    @Override
    protected String getRemoveSuccessMessage() {
        return "La météo a été supprimée avec succès.";
    }

    @Override
    protected String getRemoveErrorMessage() {
        return "La météo n'a pas pu être modifiée.";
    }

    @Override
    protected String getDoesNotExistMessage() {
        return "La météo à modifier ou supprimer n'a pas été trouvée.";
    }

    @Override
    protected String getMissingLibelleMessage() {
        return "Aucun libellé n'est spécifié pour cette météo. Veuillez renseigner un libellé pour cette météo.";
    }
}
