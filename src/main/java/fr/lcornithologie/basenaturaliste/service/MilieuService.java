package fr.lcornithologie.basenaturaliste.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.lcornithologie.basenaturaliste.model.Milieu;
import fr.lcornithologie.basenaturaliste.repository.MilieuRepository;

@Service
@Transactional
public class MilieuService extends EntiteAvecLibelleEtCodeService<Milieu> {

    private final Logger log = LoggerFactory.getLogger(MilieuService.class);

    @Autowired
    private MilieuRepository milieuRepository;

    @Override
    protected MilieuRepository getRepository() {
        return milieuRepository;
    }

    @Override
    protected Milieu getNewObject() {
        return new Milieu();
    }

    @Override
    protected String getEntityName() {
        return Milieu.ENTITY_NAME;
    }

    @Override
    protected String getAlreadyExistsMessage() {
        return "Ce milieu existe déjà: il existe déjà un milieu avec ce code ou ce libellé.";
    }

    @Override
    protected String getCreationSuccessMessage() {
        return "Le milieu a été créé avec succès.";
    }

    @Override
    protected String getCreationErrorMessage() {
        return "Le milieu n'a pas pu être créé.";
    }

    @Override
    protected String getUpdateSuccessMessage() {
        return "Le milieu a été modifié avec succès.";
    }

    @Override
    protected String getUpdateErrorMessage() {
        return "Le milieu n'a pas pu être modifié.";
    }

    @Override
    protected String getRemoveSuccessMessage() {
        return "Le milieu a été supprimé avec succès.";
    }

    @Override
    protected String getRemoveErrorMessage() {
        return "Le milieu n'a pas pu être supprimé.";
    }

    @Override
    protected String getDoesNotExistMessage() {
        return "Le milieu à modifier ou supprimer n'a pas été trouvé.";
    }

    @Override
    protected String getMissingLibelleMessage() {
        return "Aucun libellé n'a été spécifié pour ce milieu. Veuillez renseigner un libellé pour ce milieu.";
    }

    @Override
    protected String getMissingCodeMessage() {
        return "Aucun code n'a été spécifié pour ce milieu. Veuillez renseigner un code pour ce milieu.";
    }

}
