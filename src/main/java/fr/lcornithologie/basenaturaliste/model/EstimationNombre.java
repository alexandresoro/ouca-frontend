package fr.lcornithologie.basenaturaliste.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * A EstimationNombre.
 */
@Entity
@Table(name = "estimation_nombre")
public class EstimationNombre extends EntiteAvecLibelle {

    public static String ENTITY_NAME = "estimationNombre";

    private static final long serialVersionUID = 1L;

    @NotNull
    @Column(name = "non_compte", nullable = false)
    private Boolean nonCompte;

    @OneToMany(mappedBy = "estimationNombre")
    @JsonIgnore
    private Set<Donnee> donnees = new HashSet<>();

    public Set<Donnee> getDonnees() {
        return donnees;
    }

    public Boolean isNonCompte() {
        return nonCompte;
    }

    public void setDonnees(Set<Donnee> donnees) {
        this.donnees = donnees;
    }

    public void setNonCompte(Boolean nonCompte) {
        this.nonCompte = nonCompte;
    }

    @Override
    public String toString() {
        return "EstimationNombre{" + "id=" + getId() + ", libelle='" + getLibelle() + "'" + ", nonCompte='" + nonCompte
                + "'}";
    }
}
