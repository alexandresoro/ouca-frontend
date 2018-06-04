package fr.lcornithologie.basenaturaliste.service;

import java.util.Date;

import fr.lcornithologie.basenaturaliste.model.Classe;
import fr.lcornithologie.basenaturaliste.model.Commune;
import fr.lcornithologie.basenaturaliste.model.Departement;
import fr.lcornithologie.basenaturaliste.model.Espece;
import fr.lcornithologie.basenaturaliste.model.Lieudit;

public class Filter {

    private Long id;

    private Espece espece;

    private Classe classe;

    private Lieudit lieudit;

    private Commune commune;

    private Departement departement;

    private Date startDate;

    private Date endDate;

    public Long getId() {
	return id;
    }

    public void setId(Long id) {
	this.id = id;
    }

    public Espece getEspece() {
	return espece;
    }

    public void setEspece(Espece espece) {
	this.espece = espece;
    }

    public Classe getClasse() {
	return classe;
    }

    public void setClasse(Classe classe) {
	this.classe = classe;
    }

    public Lieudit getLieudit() {
	return lieudit;
    }

    public void setLieudit(Lieudit lieudit) {
	this.lieudit = lieudit;
    }

    public Commune getCommune() {
	return commune;
    }

    public void setCommune(Commune commune) {
	this.commune = commune;
    }

    public Departement getDepartement() {
	return departement;
    }

    public void setDepartement(Departement departement) {
	this.departement = departement;
    }

    public Date getStartDate() {
	return startDate;
    }

    public void setStartDate(Date startDate) {
	this.startDate = startDate;
    }

    public Date getEndDate() {
	return endDate;
    }

    public void setEndDate(Date endDate) {
	this.endDate = endDate;
    }
}
