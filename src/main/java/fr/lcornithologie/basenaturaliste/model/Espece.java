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
 * A Espece.
 */
@Entity
@Table(name = "espece")
public class Espece extends EntiteSimple {

    public static String ENTITY_NAME = "espece";

    private static final long serialVersionUID = 1L;

    @NotNull
    @Column(name = "code", nullable = false)
    private String code;

    @NotNull
    @Column(name = "nom_francais", nullable = false)
    private String nomFrancais;

    @NotNull
    @Column(name = "nom_latin", nullable = false)
    private String nomLatin;

    @ManyToOne
    private Classe classe;

    @OneToMany(mappedBy = "espece")
    @JsonIgnore
    private Set<Donnee> donnees = new HashSet<>();

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getNomFrancais() {
        return nomFrancais;
    }

    public void setNomFrancais(String nomFrancais) {
        this.nomFrancais = nomFrancais;
    }

    public String getNomLatin() {
        return nomLatin;
    }

    public void setNomLatin(String nomLatin) {
        this.nomLatin = nomLatin;
    }

    public Classe getClasse() {
        return classe;
    }

    public void setClasse(Classe classe) {
        this.classe = classe;
    }

    public Set<Donnee> getDonnees() {
        return donnees;
    }

    public void setDonnees(Set<Donnee> donnees) {
        this.donnees = donnees;
    }

    @Override
    public String toString() {
        return "Espece{" + "id=" + getId() + ", code='" + code + "'" + ", nomFrancais='" + nomFrancais + "'"
                + ", nomLatin='" + nomLatin + "'}";
    }
}
