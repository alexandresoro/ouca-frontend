package fr.lcornithologie.basenaturaliste.model;

public class AppConfiguration {

    private String applicationName;

    private Observateur defaultObservateur;

    private Departement defaultDepartement;

    private EstimationNombre defaultEstimationNombre;

    private Integer defaultNombre;

    private Sexe defaultSexe;

    private Age defaultAge;

    private boolean areAssociesDisplayed;

    private boolean isMeteoDisplayed;

    private boolean isDistanceDisplayed;

    private boolean isRegroupementDisplayed;

    private String mySqlPath;

    private String mySqlDumpPath;

    public String getApplicationName() {
        return applicationName;
    }

    public void setApplicationName(String applicationName) {
        this.applicationName = applicationName;
    }

    public Observateur getDefaultObservateur() {
        return defaultObservateur;
    }

    public void setDefaultObservateur(Observateur defaultObservateur) {
        this.defaultObservateur = defaultObservateur;
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

    public boolean isAreAssociesDisplayed() {
        return areAssociesDisplayed;
    }

    public void setAreAssociesDisplayed(boolean areAssociesDisplayed) {
        this.areAssociesDisplayed = areAssociesDisplayed;
    }

    public boolean isMeteoDisplayed() {
        return isMeteoDisplayed;
    }

    public void setMeteoDisplayed(boolean isMeteoDisplayed) {
        this.isMeteoDisplayed = isMeteoDisplayed;
    }

    public boolean isDistanceDisplayed() {
        return isDistanceDisplayed;
    }

    public void setDistanceDisplayed(boolean isDistanceDisplayed) {
        this.isDistanceDisplayed = isDistanceDisplayed;
    }

    public boolean isRegroupementDisplayed() {
        return isRegroupementDisplayed;
    }

    public void setRegroupementDisplayed(boolean isRegroupementDisplayed) {
        this.isRegroupementDisplayed = isRegroupementDisplayed;
    }

    public String isMySqlPath() {
        return mySqlPath;
    }

    public void setMySqlPath(String mySqlPath) {
        this.mySqlPath = mySqlPath;
    }

    public String getMySqlDumpPath() {
        return mySqlDumpPath;
    }

    public void setMySqlDumpPath(String mySqlDumpPath) {
        this.mySqlDumpPath = mySqlDumpPath;
    }

}
