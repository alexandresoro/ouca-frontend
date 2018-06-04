package fr.lcornithologie.basenaturaliste.controller;

import java.net.URISyntaxException;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import fr.lcornithologie.basenaturaliste.model.Donnee;
import fr.lcornithologie.basenaturaliste.model.Inventaire;
import fr.lcornithologie.basenaturaliste.page.CreationPage;
import fr.lcornithologie.basenaturaliste.page.EntiteResult;
import fr.lcornithologie.basenaturaliste.service.CreationService;

@RestController
@RequestMapping("/api/creation")
public class CreationController {

    private final Logger log = LoggerFactory.getLogger(AgeController.class);

    @Autowired
    private CreationService creationService;

    @RequestMapping(value = "/init", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public CreationPage getCreationPage() {
	log.debug("REST request to get creation page");
	return creationService.initCreationPage();
    }

    @RequestMapping(value = "/inventaire/create", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<Inventaire> createInventaire(@RequestBody Inventaire inventaire) throws URISyntaxException {
	log.debug("-- REST request to create Inventaire : {}", inventaire);
	return creationService.createInventaire(inventaire);
    }

    @RequestMapping(value = "/donnee/create", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<Donnee> createDonnee(@RequestBody Donnee donnee) throws URISyntaxException {
	log.debug("-- REST request to create Donnee : {}", donnee);
	return creationService.createDonnee(donnee);
    }

    @RequestMapping(value = "/donnee/update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<Donnee> updateDonnee(@Valid @RequestBody Donnee donnee) throws URISyntaxException {
	log.debug("REST request to update Donnee : {}", donnee);
	return creationService.updateDonnee(donnee);
    }

    @RequestMapping(value = "/donnee/delete/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<Donnee> deleteDonnee(@PathVariable Long id) {
	log.debug("REST request to delete Donnee with ID : {}", id);
	return creationService.deleteDonnee(id);
    }

    @RequestMapping(value = "/next_donnee/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Donnee getNextDonnee(@PathVariable Long id) {
	log.debug("REST request to get next donnee with ID : {}", id);
	return creationService.getNextDonnee(id);
    }

    @RequestMapping(value = "/previous_donnee/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Donnee getPreviousDonnee(@PathVariable Long id) {
	log.debug("REST request to get next donnee with ID : {}", id);
	return creationService.getPreviousDonnee(id);
    }

    @RequestMapping(value = "/next_regroupement", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public int getNextRegroupement() {
	log.debug("REST request to get next regroupement");
	return creationService.getNextRegroupement();
    }
}
