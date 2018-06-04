package fr.lcornithologie.basenaturaliste.page;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import fr.lcornithologie.basenaturaliste.model.EntiteSimple;
import fr.lcornithologie.basenaturaliste.service.TypeMessage;

public class EntiteResult<T extends EntiteSimple> implements Serializable {

    private static final long serialVersionUID = 1L;

    private T object;

    private List<UserMessage> messages = new ArrayList<>();

    private TypeMessage status;

    public EntiteResult(T object, TypeMessage status, List<UserMessage> messages) {
	this.object = object;
	this.status = status;
	this.messages = messages;
    }

    public T getObject() {
	return object;
    }

    public void setAge(T age) {
	this.object = age;
    }

    public List<UserMessage> getMessages() {
	return messages;
    }

    public TypeMessage getStatus() {
	return status;
    }

    public void setStatus(TypeMessage status) {
	this.status = status;
    }
}
