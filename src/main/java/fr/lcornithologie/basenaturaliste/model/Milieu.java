package fr.lcornithologie.basenaturaliste.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Un Milieu.
 */
@Entity
@Table(name = "milieu")
public class Milieu extends EntiteAvecLibelleEtCode {

    public static String ENTITY_NAME = "milieu";

    private static final long serialVersionUID = 1L;

    @ManyToMany(mappedBy = "milieux")
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
        return "Milieu{" + "id=" + getId() + ", code='" + getCode() + "'" + ", libelle='" + getLibelle() + "'}";
    }
}
