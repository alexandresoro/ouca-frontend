package fr.lcornithologie.basenaturaliste.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Un Sexe.
 */
@Entity
@Table(name = "sexe")
public class Sexe extends EntiteAvecLibelle {

    public static String ENTITY_NAME = "sexe";

    private static final long serialVersionUID = 1L;

    @OneToMany(mappedBy = "sexe")
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
        return "Sexe{" + "id=" + getId() + ", libelle='" + getLibelle() + "'}";
    }
}
