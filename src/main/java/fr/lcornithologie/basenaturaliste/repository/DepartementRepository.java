package fr.lcornithologie.basenaturaliste.repository;

import java.util.List;
import java.util.Optional;

import fr.lcornithologie.basenaturaliste.model.Departement;

/**
 * Spring Data JPA repository for entity Departement.
 */
public interface DepartementRepository extends EntiteSimpleRepository<Departement> {

    Optional<Departement> findOneByCode(String code);

    List<Departement> findAllByOrderByCodeAsc();
}
