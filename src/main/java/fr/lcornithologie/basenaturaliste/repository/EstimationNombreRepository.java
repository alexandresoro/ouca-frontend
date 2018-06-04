package fr.lcornithologie.basenaturaliste.repository;

import java.util.Optional;

import fr.lcornithologie.basenaturaliste.model.EstimationNombre;

/**
 * Spring Data JPA repository for entity EstimationNombre.
 */
public interface EstimationNombreRepository extends EntiteAvecLibelleRepository<EstimationNombre> {

    Optional<EstimationNombre> findOneByNonCompte(boolean nonCompte);
}
