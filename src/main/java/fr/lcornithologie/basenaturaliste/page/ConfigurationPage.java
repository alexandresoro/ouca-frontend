package fr.lcornithologie.basenaturaliste.page;

import java.util.List;
import fr.lcornithologie.basenaturaliste.model.Age;
import fr.lcornithologie.basenaturaliste.model.AppConfiguration;
import fr.lcornithologie.basenaturaliste.model.Departement;
import fr.lcornithologie.basenaturaliste.model.EstimationNombre;
import fr.lcornithologie.basenaturaliste.model.Observateur;
import fr.lcornithologie.basenaturaliste.model.Sexe;

public class ConfigurationPage {

    private AppConfiguration appConfiguration;

    private List<Observateur> observateurs;

    private List<Departement> departements;

    private List<Age> ages;

    private List<Sexe> sexes;

    private List<EstimationNombre> estimationsNombre;

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

    public AppConfiguration getAppConfiguration() {
        return appConfiguration;
    }

    public void setAppConfiguration(AppConfiguration appConfiguration) {
        this.appConfiguration = appConfiguration;
    }

}
