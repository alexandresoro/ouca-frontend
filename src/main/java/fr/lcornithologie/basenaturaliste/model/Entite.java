package fr.lcornithologie.basenaturaliste.model;

public enum Entite {

    AGE("age", "Âge"), CLASSE("classe", "Classe"), COMMUNE("commune", "Commune"), COMPORTEMENT("comportement",
	    "Comportement"), CONFIGURATION("configuration", "Configuration"), DEPARTEMENT("departement",
		    "Département"), DONNEE("donnee", "Donnée"), ESPECE("espece", "Espèce"), ESTIMATION_DISTANCE(
			    "estimationDistance", "Estimation nombre"), ESTIMATION_NOMBRE("estimationNombre",
				    "Estimation distance"), INVENTAIRE("inventaire", "Inventaire"), LIEUDIT("lieudit",
					    "Lieu-dit"), METEO("meteo", "Météo"), MILIEU("milieu",
						    "Milieu"), OBSERVATEUR("observateur",
							    "Observateur"), SEXE("sexe", "Sexe");

    String code;

    String libelle;

    private Entite(String code, String libelle) {
	this.code = code;
	this.libelle = libelle;
    }

    public String getCode() {
	return code;
    }

    public String getLibelle() {
	return libelle;
    }

}
