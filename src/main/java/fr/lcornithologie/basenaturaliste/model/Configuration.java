package fr.lcornithologie.basenaturaliste.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

/**
 * A Configuration.
 */
@Entity
@Table(name = "configuration")
public class Configuration extends EntiteSimple {

    public static String ENTITY_NAME = "configuration";

    private static final long serialVersionUID = 1L;

    @NotNull
    @Column(name = "libelle", nullable = false)
    private String libelle;

    @NotNull
    @Column(name = "value", nullable = false)
    private String value;

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "Configuration: {" + "id: " + getId() + ", libelle: '" + libelle + ", value: '" + value + "'" + "'}";
    }

}
