package fr.lcornithologie.basenaturaliste.page;

import java.io.Serializable;

import fr.lcornithologie.basenaturaliste.service.TypeMessage;

public class UserMessage implements Serializable {

    private static final long serialVersionUID = 1L;

    private String fieldId;

    private String message;

    private TypeMessage type;

    public UserMessage(String fieldId, String message, TypeMessage type) {
	this.fieldId = fieldId;
	this.message = message;
	this.type = type;
    }

    public UserMessage(String message, TypeMessage type) {
	this.message = message;
	this.type = type;
    }

    public String getFieldId() {
	return fieldId;
    }

    public void setFieldId(String fieldId) {
	this.fieldId = fieldId;
    }

    public String getValue() {
	return message;
    }

    public void setMessage(String message) {
	this.message = message;
    }

    public TypeMessage getType() {
	return type;
    }

    public void setType(TypeMessage type) {
	this.type = type;
    }

}
