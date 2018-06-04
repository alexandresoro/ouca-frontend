package fr.lcornithologie.basenaturaliste.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.validation.constraints.NotNull;

/**
 * Un ObjetSimpleLibelle.
 */
@Entity
@Inheritance
public abstract class EntiteAvecLibelleEtCode extends EntiteAvecLibelle {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Column(name = "code", nullable = false)
    private String code;

    public String getCode() {
	return code;
    }

    public void setCode(String code) {
	this.code = code;
    }

    @Override
    public int hashCode() {
	final int prime = 31;
	int result = super.hashCode();
	result = prime * result + ((code == null) ? 0 : code.hashCode());
	return result;
    }

    @Override
    public boolean equals(Object obj) {
	if (this == obj)
	    return true;
	if (!super.equals(obj))
	    return false;
	if (getClass() != obj.getClass())
	    return false;
	EntiteAvecLibelleEtCode other = (EntiteAvecLibelleEtCode) obj;
	if (code == null) {
	    if (other.code != null)
		return false;
	} else if (!code.equals(other.code))
	    return false;
	return true;
    }

    @Override
    public String toString() {
	return "ObjetSimpleLibelleEtCode [code=" + code + ", getId()=" + getId() + ", getLibelle()=" + getLibelle()
		+ "'}";
    }
}
