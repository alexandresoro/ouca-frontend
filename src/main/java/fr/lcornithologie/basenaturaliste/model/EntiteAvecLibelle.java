package fr.lcornithologie.basenaturaliste.model;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotNull;

@MappedSuperclass
public abstract class EntiteAvecLibelle extends EntiteSimple {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Column(name = "libelle", nullable = false, unique = true)
    private String libelle;

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((libelle == null) ? 0 : libelle.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        EntiteAvecLibelle other = (EntiteAvecLibelle) obj;
        if (libelle == null) {
            if (other.libelle != null)
                return false;
        } else if (!libelle.equals(other.libelle))
            return false;
        return true;
    }

    @Override
    public String toString() {
        return "Objet {" + "id=" + getId() + ", libelle='" + libelle + "'}";
    }
}
