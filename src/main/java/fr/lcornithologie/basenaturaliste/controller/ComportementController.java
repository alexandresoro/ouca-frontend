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

import fr.lcornithologie.basenaturaliste.model.Comportement;
import fr.lcornithologie.basenaturaliste.page.EntiteResult;
import fr.lcornithologie.basenaturaliste.service.ComportementService;

@RestController
@RequestMapping("/api/comportement")
public class ComportementController {

    private final Logger log = LoggerFactory.getLogger(ComportementController.class);

    @Autowired
    private ComportementService comportementService;

    @RequestMapping(value = "/all", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Comportement> getAllComportements() {
	log.debug("REST request to get all Comportements");
	return comportementService.findAll();
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public EntiteResult<Comportement> createComportement(@Valid @RequestBody Comportement comportement)
	    throws URISyntaxException {
	log.debug("-- REST request to create Comportement : {}", comportement);
	Comportement createdComportement = comportementService.create(comportement);
	return new EntiteResult<Comportement>(createdComportement, comportementService.getStatus(),
		comportementService.getMessages());
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<Comportement> updateComportement(@Valid @RequestBody Comportement comportement)
	    throws URISyntaxException {
	log.debug("REST request to update Comportement : {}", comportement);
	Comportement updatedComportement = comportementService.update(comportement);
	return new EntiteResult<Comportement>(updatedComportement, comportementService.getStatus(),
		comportementService.getMessages());
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<Comportement> deleteComportement(@PathVariable Long id) {
	log.debug("REST request to delete Comportement : {}", id);
	comportementService.delete(id);
	return new EntiteResult<Comportement>(null, comportementService.getStatus(), comportementService.getMessages());
    }
}
