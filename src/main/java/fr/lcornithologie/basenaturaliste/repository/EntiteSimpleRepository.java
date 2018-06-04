package fr.lcornithologie.basenaturaliste.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import fr.lcornithologie.basenaturaliste.model.EntiteSimple;

/**
 * Spring Data JPA repository for entity EntiteSimple.
 */
@NoRepositoryBean
public interface EntiteSimpleRepository<T extends EntiteSimple> extends JpaRepository<T, Long> {

}
