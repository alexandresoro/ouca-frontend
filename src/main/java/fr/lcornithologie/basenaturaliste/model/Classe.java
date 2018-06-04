package fr.lcornithologie.basenaturaliste.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Une Classe.
 */
@Entity
@Table(name = "classe")
public class Classe extends EntiteAvecLibelle {

    public static String ENTITY_NAME = "classe";

    private static final long serialVersionUID = 1L;

    @OneToMany(mappedBy = "classe", cascade = CascadeType.REMOVE)
    private Set<Espece> especes = new HashSet<>();

    @JsonIgnore
    public Set<Espece> getEspeces() {
        return especes;
    }

    public void setEspeces(Set<Espece> especes) {
        this.especes = especes;
    }

    public int getNbEspeces() {
        return especes.size();
    }

    @Override
    public String toString() {
        return "Classe {" + "id=" + getId() + ", libelle='" + getLibelle() + "'}";
    }
}
