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
 * Un Département.
 */
@Entity
@Table(name = "departement")
public class Departement extends EntiteSimple {

    public static final String ENTITY_NAME = "département";

    private static final long serialVersionUID = 1L;

    @NotNull
    @Column(name = "code", nullable = false)
    private String code;

    @OneToMany(mappedBy = "departement")
    @JsonIgnore
    private Set<Commune> communes = new HashSet<>();

    public String getCode() {
	return code;
    }

    public Set<Commune> getCommunes() {
	return communes;
    }

    public void setCode(String code) {
	this.code = code;
    }

    public void setCommunes(Set<Commune> communes) {
	this.communes = communes;
    }

    @Override
    public String toString() {
	return "Departement{" + "id=" + getId() + ", code='" + code + "'}";
    }

}
