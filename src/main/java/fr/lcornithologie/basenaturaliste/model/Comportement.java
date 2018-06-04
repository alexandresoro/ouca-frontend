package fr.lcornithologie.basenaturaliste.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Un Comportement.
 */
@Entity
@Table(name = "comportement")
public class Comportement extends EntiteAvecLibelleEtCode {

    public static String ENTITY_NAME = "comportement";

    private static final long serialVersionUID = 1L;

    @ManyToMany(mappedBy = "comportements")
    @JsonIgnore
    private Set<Donnee> donnees = new HashSet<>();

    public Set<Donnee> getDonnees() {
        return donnees;
    }

    public void setDonnees(Set<Donnee> donnees) {
        this.donnees = donnees;
    }

    @Override
    public String toString() {
        return "Comportement: {" + "id: " + getId() + ", code='" + getCode() + "'" + ", libelle='" + getLibelle() + "'"
                + "'}";
    }
}
