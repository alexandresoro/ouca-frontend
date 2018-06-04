package fr.lcornithologie.basenaturaliste.page;

import java.util.Date;
import java.util.List;

import fr.lcornithologie.basenaturaliste.model.Age;
import fr.lcornithologie.basenaturaliste.model.Classe;
import fr.lcornithologie.basenaturaliste.model.Commune;
import fr.lcornithologie.basenaturaliste.model.Comportement;
import fr.lcornithologie.basenaturaliste.model.Departement;
import fr.lcornithologie.basenaturaliste.model.Donnee;
import fr.lcornithologie.basenaturaliste.model.Espece;
import fr.lcornithologie.basenaturaliste.model.EstimationDistance;
import fr.lcornithologie.basenaturaliste.model.EstimationNombre;
import fr.lcornithologie.basenaturaliste.model.Lieudit;
import fr.lcornithologie.basenaturaliste.model.Meteo;
import fr.lcornithologie.basenaturaliste.model.Milieu;
import fr.lcornithologie.basenaturaliste.model.Observateur;
import fr.lcornithologie.basenaturaliste.model.Sexe;

public class CreationPage {

    private Observateur defaultObservateur;

    private Date defaultDate;

    private Departement defaultDepartement;

    private EstimationNombre defaultEstimationNombre;

    private Integer defaultNombre;

    private Sexe defaultSexe;

    private Age defaultAge;

    private List<Observateur> observateurs;

    private List<Departement> departements;

    private List<Commune> communes;

    private List<Lieudit> lieudits;

    private List<Meteo> meteos;

    private List<Classe> classes;

    private List<Espece> especes;

    private List<Age> ages;

    private List<Sexe> sexes;

    private List<EstimationNombre> estimationsNombre;

    private List<EstimationDistance> estimationsDistance;

    private List<Comportement> comportements;

    private List<Milieu> milieux;

    private boolean areAssociesDisplayed;

    private boolean isMeteoDisplayed;

    private boolean isDistanceDisplayed;

    private boolean isRegroupementDisplayed;

    private long numberOfDonnees;

    private Donnee lastDonnee;

    private int nextRegroupement;

    public List<Observateur> getObservateurs() {
        return observateurs;
    }

    public void setObservateurs(List<Observateur> observateurs) {
        this.observateurs = observateurs;
    }

    public List<Departement> getDepartements() {
        return departements;
    }

    public void setDepartements(List<Departement> departements) {
        this.departements = departements;
    }

    public List<Commune> getCommunes() {
        return communes;
    }

    public void setCommunes(List<Commune> communes) {
        this.communes = communes;
    }

    public List<Lieudit> getLieudits() {
        return lieudits;
    }

    public void setLieudits(List<Lieudit> lieudits) {
        this.lieudits = lieudits;
    }

    public List<Age> getAges() {
        return ages;
    }

    public void setAges(List<Age> ages) {
        this.ages = ages;
    }

    public List<Sexe> getSexes() {
        return sexes;
    }

    public void setSexes(List<Sexe> sexes) {
        this.sexes = sexes;
    }

    public List<EstimationNombre> getEstimationsNombre() {
        return estimationsNombre;
    }

    public void setEstimationsNombre(List<EstimationNombre> estimationsNombre) {
        this.estimationsNombre = estimationsNombre;
    }

    public List<EstimationDistance> getEstimationsDistance() {
        return estimationsDistance;
    }

    public void setEstimationsDistance(List<EstimationDistance> estimationsDistance) {
        this.estimationsDistance = estimationsDistance;
    }

    public List<Comportement> getComportements() {
        return comportements;
    }

    public void setComportements(List<Comportement> comportements) {
        this.comportements = comportements;
    }

    public List<Milieu> getMilieux() {
        return milieux;
    }

    public void setMilieux(List<Milieu> milieux) {
        this.milieux = milieux;
    }

    public List<Meteo> getMeteos() {
        return meteos;
    }

    public void setMeteos(List<Meteo> meteos) {
        this.meteos = meteos;
    }

    public List<Classe> getClasses() {
        return classes;
    }

    public void setClasses(List<Classe> classes) {
        this.classes = classes;
    }

    public List<Espece> getEspeces() {
        return especes;
    }

    public void setEspeces(List<Espece> especes) {
        this.especes = especes;
    }

    public Observateur getDefaultObservateur() {
        return defaultObservateur;
    }

    public void setDefaultObservateur(Observateur defaultObservateur) {
        this.defaultObservateur = defaultObservateur;
    }

    public Date getDefaultDate() {
        return defaultDate;
    }

    public void setDefaultDate(Date defaultDate) {
        this.defaultDate = defaultDate;
    }

    public Departement getDefaultDepartement() {
        return defaultDepartement;
    }

    public void setDefaultDepartement(Departement defaultDepartement) {
        this.defaultDepartement = defaultDepartement;
    }

    public EstimationNombre getDefaultEstimationNombre() {
        return defaultEstimationNombre;
    }

    public void setDefaultEstimationNombre(EstimationNombre defaultEstimationNombre) {
        this.defaultEstimationNombre = defaultEstimationNombre;
    }

    public Integer getDefaultNombre() {
        return defaultNombre;
    }

    public void setDefaultNombre(Integer defaultNombre) {
        this.defaultNombre = defaultNombre;
    }

    public Sexe getDefaultSexe() {
        return defaultSexe;
    }

    public void setDefaultSexe(Sexe defaultSexe) {
        this.defaultSexe = defaultSexe;
    }

    public Age getDefaultAge() {
        return defaultAge;
    }

    public void setDefaultAge(Age defaultAge) {
        this.defaultAge = defaultAge;
    }

    public boolean getIsMeteoDisplayed() {
        return isMeteoDisplayed;
    }

    public void setIsMeteoDisplayed(boolean isMeteoDisplayed) {
        this.isMeteoDisplayed = isMeteoDisplayed;
    }

    public boolean getIsDistanceDisplayed() {
        return isDistanceDisplayed;
    }

    public void setIsDistanceDisplayed(boolean isDistanceDisplayed) {
        this.isDistanceDisplayed = isDistanceDisplayed;
    }

    public boolean getIsRegroupementDisplayed() {
        return isRegroupementDisplayed;
    }

    public void setIsRegroupementDisplayed(boolean isRegroupementDisplayed) {
        this.isRegroupementDisplayed = isRegroupementDisplayed;
    }

    public long getNumberOfDonnees() {
        return numberOfDonnees;
    }

    public void setNumberOfDonnees(long numberOfDonnees) {
        this.numberOfDonnees = numberOfDonnees;
    }

    public Donnee getLastDonnee() {
        return lastDonnee;
    }

    public void setLastDonnee(Donnee lastDonnee) {
        this.lastDonnee = lastDonnee;
    }

    public boolean isAreAssociesDisplayed() {
        return areAssociesDisplayed;
    }

    public void setAreAssociesDisplayed(boolean areAssociesDisplayed) {
        this.areAssociesDisplayed = areAssociesDisplayed;
    }

    public int getNextRegroupement() {
        return nextRegroupement;
    }

    public void setNextRegroupement(int nextRegroupement) {
        this.nextRegroupement = nextRegroupement;
    }

}
