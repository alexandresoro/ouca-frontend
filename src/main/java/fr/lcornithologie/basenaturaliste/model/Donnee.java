package fr.lcornithologie.basenaturaliste.model;

import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

/**
 * A Donnee.
 */
@Entity
@Table(name = "donnee")
public class Donnee extends EntiteSimple {

    public static String ENTITY_NAME = "donnee";

    private static final long serialVersionUID = 1L;

    @Column(name = "nombre", nullable = false)
    private Integer nombre;

    @Column(name = "distance")
    private Integer distance;

    @Column(name = "regroupement")
    private Integer regroupement;

    @Column(name = "commentaire")
    private String commentaire;

    @NotNull
    @Column(name = "date_creation", nullable = false)
    private Timestamp dateCreation;

    @ManyToOne
    private Espece espece;

    @ManyToOne
    private Sexe sexe;

    @ManyToOne
    private Age age;

    @ManyToOne
    private Inventaire inventaire;

    @ManyToOne
    private EstimationNombre estimationNombre;

    @ManyToOne
    private EstimationDistance estimationDistance;

    @ManyToMany
    @JoinTable(name = "donnee_comportement",
            joinColumns = @JoinColumn(name = "donnees_id", referencedColumnName = "ID"),
            inverseJoinColumns = @JoinColumn(name = "comportements_id",
                    referencedColumnName = "ID"))
    private Set<Comportement> comportements = new HashSet<>();

    @ManyToMany
    @JoinTable(name = "donnee_milieu",
            joinColumns = @JoinColumn(name = "donnees_id", referencedColumnName = "ID"),
            inverseJoinColumns = @JoinColumn(name = "milieux_id", referencedColumnName = "ID"))
    private Set<Milieu> milieux = new HashSet<>();

    public Age getAge() {
        return age;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public Set<Comportement> getComportements() {
        return comportements;
    }

    public Timestamp getDateCreation() {
        return dateCreation;
    }

    public Integer getDistance() {
        return distance;
    }

    public Espece getEspece() {
        return espece;
    }

    public EstimationDistance getEstimationDistance() {
        return estimationDistance;
    }

    public EstimationNombre getEstimationNombre() {
        return estimationNombre;
    }

    public Inventaire getInventaire() {
        return inventaire;
    }

    public Set<Milieu> getMilieux() {
        return milieux;
    }

    public Integer getNombre() {
        return nombre;
    }

    public Integer getRegroupement() {
        return regroupement;
    }

    public Sexe getSexe() {
        return sexe;
    }

    public void setAge(Age age) {
        this.age = age;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public void setComportements(Set<Comportement> comportements) {
        this.comportements = comportements;
    }

    public void setDateCreation(Timestamp dateCreation) {
        this.dateCreation = dateCreation;
    }

    public void setDistance(Integer distance) {
        this.distance = distance;
    }

    public void setEspece(Espece espece) {
        this.espece = espece;
    }

    public void setEstimationDistance(EstimationDistance estimationDistance) {
        this.estimationDistance = estimationDistance;
    }

    public void setEstimationNombre(EstimationNombre estimationNombre) {
        this.estimationNombre = estimationNombre;
    }

    public void setInventaire(Inventaire inventaire) {
        this.inventaire = inventaire;
    }

    public void setMilieux(Set<Milieu> milieus) {
        milieux = milieus;
    }

    public void setNombre(Integer nombre) {
        this.nombre = nombre;
    }

    public void setRegroupement(Integer regroupement) {
        this.regroupement = regroupement;
    }

    public void setSexe(Sexe sexe) {
        this.sexe = sexe;
    }

    @Override
    public String toString() {
        return "Donnee{" + "id=" + getId() + ", nombre='" + nombre + "'" + ", distance='" + distance
                + "'" + ", commentaire='" + commentaire + "'" + ", dateCreation='" + dateCreation
                + "'}";
    }
}
