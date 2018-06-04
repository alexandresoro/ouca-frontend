package fr.lcornithologie.basenaturaliste.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import fr.lcornithologie.basenaturaliste.model.EntiteAvecLibelle;
import fr.lcornithologie.basenaturaliste.repository.EntiteAvecLibelleRepository;

@Service
@Transactional
public abstract class EntiteAvecLibelleService<T extends EntiteAvecLibelle> extends EntiteSimpleService<T> {

    @Override
    protected abstract EntiteAvecLibelleRepository<T> getRepository();

    protected abstract String getMissingLibelleMessage();

    /**
     * Find all entities ordered by Libellé ASC
     *
     * @return List<T>
     */
    @Override
    public List<T> findAll() {
        return getRepository().findAllByOrderByLibelleAsc();
    }

    /**
     * Find entity by Libellé
     *
     * @param libelle
     * @return null if the entity is not found
     */
    private T findOneByLibelle(String libelle) {
        T result = null;
        if (libelle != null) {
            Optional<T> entity = getRepository().findOneByLibelle(libelle);
            if (entity.isPresent()) {
                result = entity.get();
            }
        }
        return result;
    }

    @Override
    protected boolean isValid(T object) {
        return isLibelleValid(object.getLibelle());
    }

    private boolean isLibelleValid(String libelle) {
        boolean isValid = !StringUtils.isEmpty(libelle);

        if (!isValid) {
            log.warn("-- Libelle of {0} cannot be null or empty : {1}", this.getEntityName(), libelle);
            addErrorMessage(getMissingLibelleMessage());
        }

        return isValid;
    }

    @Override
    protected boolean isNew(T object) {
        T existingObject = findOneByLibelle(object.getLibelle());
        return isNew(object, existingObject);
    }

}