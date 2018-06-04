package fr.lcornithologie.basenaturaliste.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * A Meteo.
 */
@Entity
@Table(name = "meteo")
public class Meteo extends EntiteAvecLibelle {

    public static String ENTITY_NAME = "meteo";

    private static final long serialVersionUID = 1L;

    @ManyToMany(mappedBy = "meteos")
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
        return "Meteo{" + "id=" + getId() + ", libelle='" + getLibelle() + "'}";
    }
}
