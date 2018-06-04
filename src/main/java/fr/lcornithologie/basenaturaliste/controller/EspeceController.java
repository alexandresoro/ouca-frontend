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

import fr.lcornithologie.basenaturaliste.model.Espece;
import fr.lcornithologie.basenaturaliste.page.EntiteResult;
import fr.lcornithologie.basenaturaliste.service.EspeceService;

@RestController
@RequestMapping("/api/espece")
public class EspeceController {

    private final Logger log = LoggerFactory.getLogger(EspeceController.class);

    @Autowired
    private EspeceService especeService;

    @RequestMapping(value = "/all", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Espece> getAllEspeces() {
	log.debug("REST request to get all Espèces");
	return especeService.findAll();
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public EntiteResult<Espece> createEspece(@Valid @RequestBody Espece espece) throws URISyntaxException {
	log.debug("-- REST request to create Espece : {}", espece);
	Espece createdEspece = especeService.create(espece);
	return new EntiteResult<Espece>(createdEspece, especeService.getStatus(), especeService.getMessages());
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<Espece> updateEspece(@Valid @RequestBody Espece espece) throws URISyntaxException {
	log.debug("REST request to update Espece : {}", espece);
	Espece updatedEspece = especeService.update(espece);
	return new EntiteResult<Espece>(updatedEspece, especeService.getStatus(), especeService.getMessages());
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<Espece> deleteEspece(@PathVariable Long id) {
	log.debug("REST request to delete Espece : {}", id);
	especeService.delete(id);
	return new EntiteResult<Espece>(null, especeService.getStatus(), especeService.getMessages());
    }
}
