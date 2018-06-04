package fr.lcornithologie.basenaturaliste.controller;

import java.net.URISyntaxException;
import java.util.List;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import fr.lcornithologie.basenaturaliste.model.Observateur;
import fr.lcornithologie.basenaturaliste.page.EntiteResult;
import fr.lcornithologie.basenaturaliste.service.ObservateurService;

@RestController
@RequestMapping("/api/observateur")
public class ObservateurController {

    private final Logger log = LoggerFactory.getLogger(ObservateurController.class);

    @Autowired
    private ObservateurService observateurService;

    @RequestMapping(value = "/all", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Observateur> getAllObservateurs() {
	log.debug("REST request to get all Observateurs");
	return observateurService.findAll();
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public EntiteResult<Observateur> createObservateur(@Valid @RequestBody Observateur observateur)
	    throws URISyntaxException {
	log.debug("-- REST request to create Observateur : {}", observateur);
	Observateur createdObservateur = observateurService.create(observateur);
	return new EntiteResult<Observateur>(createdObservateur, observateurService.getStatus(),
		observateurService.getMessages());
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<Observateur> updateObservateur(@Valid @RequestBody Observateur observateur)
	    throws URISyntaxException {
	log.debug("REST request to update Observateur : {}", observateur);
	Observateur updatedObservateur = observateurService.update(observateur);
	return new EntiteResult<Observateur>(updatedObservateur, observateurService.getStatus(),
		observateurService.getMessages());
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<Observateur> deleteObservateur(@PathVariable Long id) {
	log.debug("REST request to delete Observateur : {}", id);
	observateurService.delete(id);
	return new EntiteResult<Observateur>(null, observateurService.getStatus(), observateurService.getMessages());
    }
}
