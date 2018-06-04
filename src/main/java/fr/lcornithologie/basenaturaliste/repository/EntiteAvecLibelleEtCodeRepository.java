package fr.lcornithologie.basenaturaliste.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.NoRepositoryBean;

import fr.lcornithologie.basenaturaliste.model.EntiteAvecLibelle;

/**
 * Spring Data JPA repository for entity EntiteAvecLibelleEtCode.
 */
@NoRepositoryBean
public interface EntiteAvecLibelleEtCodeRepository<T extends EntiteAvecLibelle> extends EntiteSimpleRepository<T> {

    public List<T> findAllByOrderByLibelleAsc();

    public Optional<T> findOneByLibelle(String libelle);

    public Optional<T> findOneByCodeAndLibelle(String code, String libelle);

    public Optional<T> findOneByCode(String code);

}
