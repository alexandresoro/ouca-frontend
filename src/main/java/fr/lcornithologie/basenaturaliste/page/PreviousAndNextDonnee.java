package fr.lcornithologie.basenaturaliste.page;

import fr.lcornithologie.basenaturaliste.model.Donnee;

public class PreviousAndNextDonnee {

    private Donnee previousDonnee;

    private Donnee nextDonnee;

    public PreviousAndNextDonnee(Donnee previousDonnee, Donnee nextDonnee) {
	this.previousDonnee = previousDonnee;
	this.nextDonnee = nextDonnee;
    }

    public Donnee getPreviousDonnee() {
	return previousDonnee;
    }

    public void setPreviousDonnee(Donnee previousDonnee) {
	this.previousDonnee = previousDonnee;
    }

    public Donnee getNextDonnee() {
	return nextDonnee;
    }

    public void setNextDonnee(Donnee nextDonnee) {
	this.nextDonnee = nextDonnee;
    }
}
