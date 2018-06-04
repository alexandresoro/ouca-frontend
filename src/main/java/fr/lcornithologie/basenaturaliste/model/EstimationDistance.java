package fr.lcornithologie.basenaturaliste.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * A EstimationDistance.
 */
@Entity
@Table(name = "estimation_distance")
public class EstimationDistance extends EntiteAvecLibelle {

    private static final long serialVersionUID = 1L;

    @OneToMany(mappedBy = "estimationDistance")
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
	return "EstimationDistance{" + "id=" + getId() + ", libelle='" + getLibelle() + "'}";
    }
}
