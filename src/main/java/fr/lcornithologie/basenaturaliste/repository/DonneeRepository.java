package fr.lcornithologie.basenaturaliste.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import fr.lcornithologie.basenaturaliste.model.Donnee;

/**
 * Spring Data JPA repository for entity Donnee.
 */
public interface DonneeRepository extends EntiteSimpleRepository<Donnee> {

    @Query("select distinct donnee from Donnee donnee left join fetch donnee.comportements left join fetch donnee.milieux")
    List<Donnee> findAllWithEagerRelationships();

    @Query("select donnee from Donnee donnee left join fetch donnee.comportements left join fetch donnee.milieux where donnee.id =:id")
    Donnee findOneWithEagerRelationships(@Param("id") Long id);

    @Query("select count(*) from Donnee donnee where donnee.inventaire.id =:id")
    int countDonneesByInventaire(@Param("id") Long id);

    // TODO 100 dernieres données

    // TODO 100 dernieres especes

    // TODO données par filtre

    // TODO especes par filtre

    @Query("select MAX(d.regroupement) from Donnee d")
    Integer findLastRegroupement();

    /**
     * Get the last donnee
     */
    Donnee findFirstByOrderByIdDesc();

    /**
     * Get next donnee by previous ID
     */
    Donnee findFirstByIdGreaterThanOrderByIdAsc(long previousId);

    /**
     * Find previous donneee by next ID
     */
    Donnee findFirstByIdLessThanOrderByIdDesc(long nextId);

}
