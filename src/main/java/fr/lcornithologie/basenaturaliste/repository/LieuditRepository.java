package fr.lcornithologie.basenaturaliste.repository;

import java.util.List;
import java.util.Optional;

import fr.lcornithologie.basenaturaliste.model.Commune;
import fr.lcornithologie.basenaturaliste.model.Lieudit;

/**
 * Spring Data JPA repository for entity Lieudit.
 */
public interface LieuditRepository extends EntiteSimpleRepository<Lieudit> {

    Optional<Lieudit> findOneByNomAndCommune(String nom, Commune commune);

    Optional<Lieudit> findOneByNomAndCommuneAndAltitudeAndLongitudeAndLatitude(String nom, Commune commune,
	    long altitude, long longitude, long latitude);

    List<Lieudit> findAllByOrderByNomAsc();

    // List<Lieudit> findAllByModeCreationOrderByNomAsc(ModeCreation mode);
}
