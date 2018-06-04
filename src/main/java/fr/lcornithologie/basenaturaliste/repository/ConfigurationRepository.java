package fr.lcornithologie.basenaturaliste.repository;

import java.util.Optional;

import fr.lcornithologie.basenaturaliste.model.Configuration;

/**
 * Spring Data JPA repository for entity Configuration.
 */
public interface ConfigurationRepository extends EntiteSimpleRepository<Configuration> {

    Optional<Configuration> findOneByLibelle(String name);
}
