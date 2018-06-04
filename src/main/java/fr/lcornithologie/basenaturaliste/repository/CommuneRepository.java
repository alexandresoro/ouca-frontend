package fr.lcornithologie.basenaturaliste.repository;

import java.util.List;
import java.util.Optional;

import fr.lcornithologie.basenaturaliste.model.Commune;
import fr.lcornithologie.basenaturaliste.model.Departement;

/**
 * Spring Data JPA repository for entity Commune.
 */
public interface CommuneRepository extends EntiteSimpleRepository<Commune> {

    Optional<Commune> findOneByCodeAndDepartement(Integer code, Departement departement);

    Optional<Commune> findOneByNomAndDepartement(String nom, Departement departement);

    List<Commune> findAllByOrderByCodeAsc();

    List<Commune> findAllByOrderByNomAsc();
}
