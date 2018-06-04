package fr.lcornithologie.basenaturaliste.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import fr.lcornithologie.basenaturaliste.model.Inventaire;

/**
 * Spring Data JPA repository for entity Inventaire.
 */
public interface InventaireRepository extends EntiteSimpleRepository<Inventaire> {

    @Query("select distinct inventaire from Inventaire inventaire left join fetch inventaire.meteos left join fetch inventaire.associes")
    List<Inventaire> findAllWithEagerRelationships();

    @Query("select inventaire from Inventaire inventaire left join fetch inventaire.meteos left join fetch inventaire.associes where inventaire.id =:id")
    Inventaire findOneWithEagerRelationships(@Param("id") Long id);

}
