package fr.lcornithologie.basenaturaliste.service;

public class MessageUtilisateur {

    private TypeMessage type;

    private String message;

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
