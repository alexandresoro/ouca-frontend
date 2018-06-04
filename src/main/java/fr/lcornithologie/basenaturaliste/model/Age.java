package fr.lcornithologie.basenaturaliste.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * A Age.
 */
@Entity
@Table(name = "age")
public class Age extends EntiteAvecLibelle {

    public static String ENTITY_NAME = "age";

    private static final long serialVersionUID = 1L;

    @OneToMany(mappedBy = "age")
    private Set<Donnee> donnees = new HashSet<>();

    @JsonIgnore
    public Set<Donnee> getDonnees() {
        return donnees;
    }

    public void setDonnees(Set<Donnee> donnees) {
        this.donnees = donnees;
    }

    @Override
    public String toString() {
        return "Age: {" + "id: " + getId() + ", libelle: '" + getLibelle() + "'}";
    }

}
