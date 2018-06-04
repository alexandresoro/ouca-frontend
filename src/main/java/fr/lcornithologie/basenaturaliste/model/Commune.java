package fr.lcornithologie.basenaturaliste.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * A Commune.
 */
@Entity
@Table(name = "commune")
public class Commune extends EntiteSimple {

    public static String ENTITY_NAME = "commune";

    private static final long serialVersionUID = 1L;

    @NotNull
    @Column(name = "code", nullable = false)
    private Integer code;

    @NotNull
    @Column(name = "nom", nullable = false)
    private String nom;

    @ManyToOne
    private Departement departement;

    @OneToMany(mappedBy = "commune")
    @JsonIgnore
    private Set<Lieudit> lieudits = new HashSet<>();

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Departement getDepartement() {
        return departement;
    }

    public void setDepartement(Departement departement) {
        this.departement = departement;
    }

    public void setLieudits(Set<Lieudit> lieudits) {
        this.lieudits = lieudits;
    }

    @Override
    public String toString() {
        return "Commune: {" + "id: " + getId() + ", code: '" + code + "'" + ", nom: '" + nom + "'" + "'}";
    }
}
