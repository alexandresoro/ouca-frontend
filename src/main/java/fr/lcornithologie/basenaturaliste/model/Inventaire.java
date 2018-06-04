package fr.lcornithologie.basenaturaliste.model;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Un Inventaire.
 */
@Entity
@Table(name = "inventaire")
public class Inventaire extends EntiteSimple {

    public static String ENTITY_NAME = "Inventaire";

    private static final long serialVersionUID = 1L;

    @NotNull
    @Column(name = "date", nullable = false)
    private Date date;

    @Column(name = "heure")
    private String heure;

    @Column(name = "duree")
    private String duree;

    @Column(name = "temperature")
    private Integer temperature;

    @NotNull
    @Column(name = "date_creation", nullable = false)
    private Timestamp dateCreation;

    @ManyToOne
    private Observateur observateur;

    @ManyToOne
    private Lieudit lieudit;

    @Column(name = "altitude")
    private long altitude;

    @Column(name = "longitude")
    private long longitude;

    @Column(name = "latitude")
    private long latitude;

    @ManyToMany
    @JoinTable(name = "inventaire_meteos", joinColumns = @JoinColumn(name = "inventaires_id", referencedColumnName = "ID"), inverseJoinColumns = @JoinColumn(name = "meteos_id", referencedColumnName = "ID"))
    private Set<Meteo> meteos = new HashSet<>();

    @OneToMany(mappedBy = "inventaire", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private Set<Donnee> donnees = new HashSet<>();

    @ManyToMany
    @JoinTable(name = "inventaire_associes", joinColumns = @JoinColumn(name = "inventaires_id", referencedColumnName = "ID"), inverseJoinColumns = @JoinColumn(name = "associes_id", referencedColumnName = "ID"))
    private Set<Observateur> associes = new HashSet<>();

    public Set<Observateur> getAssocies() {
        return associes;
    }

    public Date getDate() {
        return date;
    }

    public Timestamp getDateCreation() {
        return dateCreation;
    }

    @JsonIgnore
    public Set<Donnee> getDonnees() {
        return donnees;
    }

    public String getDuree() {
        return duree;
    }

    public String getHeure() {
        return heure;
    }

    public Lieudit getLieudit() {
        return lieudit;
    }

    public Set<Meteo> getMeteos() {
        return meteos;
    }

    public Observateur getObservateur() {
        return observateur;
    }

    public Integer getTemperature() {
        return temperature;
    }

    public void setAssocies(Set<Observateur> associes) {
        this.associes = associes;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public void setDateCreation(Timestamp defaultDateCreation) {
        dateCreation = defaultDateCreation;
    }

    public void setDuree(String duree) {
        this.duree = duree;
    }

    public void setHeure(String heure) {
        this.heure = heure;
    }

    public void setLieudit(Lieudit lieudit) {
        this.lieudit = lieudit;
    }

    public void setMeteos(Set<Meteo> meteos) {
        this.meteos = meteos;
    }

    public void setObservateur(Observateur observateur) {
        this.observateur = observateur;
    }

    public long getAltitude() {
        return altitude;
    }

    public void setAltitude(long altitude) {
        this.altitude = altitude;
    }

    public long getLongitude() {
        return longitude;
    }

    public void setLongitude(long longitude) {
        this.longitude = longitude;
    }

    public long getLatitude() {
        return latitude;
    }

    public void setLatitude(long latitude) {
        this.latitude = latitude;
    }

    public void setTemperature(Integer temperature) {
        this.temperature = temperature;
    }

    // TODO ajouter associés et météos
    @Override
    public String toString() {
        return "{" + "id:" + getId() + ", date:" + date + "" + ", heure:'" + heure + "'" + ", duree:'" + duree + "'"
                + ", lieudit:" + lieudit + ", temperature:" + temperature + ", dateCreation:'" + dateCreation + "'"
                + "'}";
    }
}
