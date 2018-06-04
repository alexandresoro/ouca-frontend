package fr.lcornithologie.basenaturaliste.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.NoRepositoryBean;

import fr.lcornithologie.basenaturaliste.model.EntiteAvecLibelle;

/**
 * Spring Data JPA repository for entity EntiteAvecLibelle.
 */
@NoRepositoryBean
public interface EntiteAvecLibelleRepository<T extends EntiteAvecLibelle> extends EntiteSimpleRepository<T> {

    List<T> findAllByOrderByLibelleAsc();

    Optional<T> findOneByLibelle(String label);

}
