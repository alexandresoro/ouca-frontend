package fr.lcornithologie.basenaturaliste.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * A Lieudit.
 */
@Entity
@Table(name = "lieudit")
public class Lieudit extends EntiteSimple {

    public static String ENTITY_NAME = "lieudit";

    private static final long serialVersionUID = 1L;

    @NotNull
    @Column(name = "nom", nullable = false)
    private String nom;

    @NotNull
    @Column(name = "altitude", nullable = false)
    private long altitude;

    @NotNull
    @Column(name = "longitude", nullable = false)
    private long longitude;

    @NotNull
    @Column(name = "latitude", nullable = false)
    private long latitude;

    @ManyToOne
    private Commune commune;

    @OneToMany(mappedBy = "lieudit", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private Set<Inventaire> inventaires = new HashSet<>();

    public long getAltitude() {
        return altitude;
    }

    public Commune getCommune() {
        return commune;
    }

    public Set<Inventaire> getInventaires() {
        return inventaires;
    }

    public long getLatitude() {
        return latitude;
    }

    public long getLongitude() {
        return longitude;
    }

    public String getNom() {
        return nom;
    }

    public void setAltitude(long altitude) {
        this.altitude = altitude;
    }

    public void setCommune(Commune commune) {
        this.commune = commune;
    }

    public void setInventaires(Set<Inventaire> inventaires) {
        this.inventaires = inventaires;
    }

    public void setLatitude(long latitude) {
        this.latitude = latitude;
    }

    public void setLongitude(long longitude) {
        this.longitude = longitude;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    @Override
    public String toString() {
        return "Lieudit{" + "id=" + getId() + ", nom='" + nom + "'" + ", altitude='" + altitude + "'" + ", longitude='"
                + longitude + "'" + ", latitude='" + latitude + "'" + "'}";
    }
}
