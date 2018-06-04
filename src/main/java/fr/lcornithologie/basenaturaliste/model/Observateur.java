package fr.lcornithologie.basenaturaliste.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * A Observateur.
 */
@Entity
@Table(name = "observateur")
public class Observateur extends EntiteAvecLibelle {

    public static String ENTITY_NAME = "observateur";

    private static final long serialVersionUID = 1L;

    @OneToMany(mappedBy = "observateur")
    @JsonIgnore
    private Set<Inventaire> inventaires = new HashSet<>();

    public Set<Inventaire> getInventaires() {
        return inventaires;
    }

    public void setInventaires(Set<Inventaire> inventaires) {
        this.inventaires = inventaires;
    }

    @Override
    public String toString() {
        return "Observateur{" + "id=" + getId() + ", libellé='" + getLibelle() + "'}";
    }

}
