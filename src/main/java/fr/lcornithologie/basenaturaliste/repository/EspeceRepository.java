package fr.lcornithologie.basenaturaliste.repository;

import java.util.List;
import java.util.Optional;

import fr.lcornithologie.basenaturaliste.model.Espece;

/**
 * Spring Data JPA repository for entity Espece.
 */
public interface EspeceRepository extends EntiteSimpleRepository<Espece> {

    Optional<Espece> findOneByCode(String code);

    Optional<Espece> findOneByNomFrancais(String nomFrancais);

    List<Espece> findAllByOrderByCodeAsc();

    List<Espece> findAllByOrderByNomFrancaisAsc(); // TODO Nom_francais or
						   // NomFrancais ?
}
