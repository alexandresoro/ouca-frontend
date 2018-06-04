package fr.lcornithologie.basenaturaliste.service;

import java.util.ArrayList;
import java.util.List;

public class MessageUtilisateur {

    private TypeMessage type;

    private String message;

    private List<String> fields = new ArrayList<>();

    public MessageUtilisateur(TypeMessage type, String message) {
	this.type = type;
	this.message = message;
    }

    public String getMessage() {
	return message;
    }

    public TypeMessage getType() {
	return type;
    }

    public void setMessage(String message) {
	this.message = message;
    }

    public void setType(TypeMessage type) {
	this.type = type;
    }

}
