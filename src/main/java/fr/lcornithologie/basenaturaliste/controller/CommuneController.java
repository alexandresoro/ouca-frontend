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

import fr.lcornithologie.basenaturaliste.model.Commune;
import fr.lcornithologie.basenaturaliste.page.EntiteResult;
import fr.lcornithologie.basenaturaliste.service.CommuneService;

@RestController
@RequestMapping("/api/commune")
public class CommuneController {

    private final Logger log = LoggerFactory.getLogger(CommuneController.class);

    @Autowired
    private CommuneService communeService;

    @RequestMapping(value = "/all", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Commune> getAllCommunes() {
	log.debug("REST request to get all Communes");
	return communeService.findAll();
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public EntiteResult<Commune> createCommune(@Valid @RequestBody Commune commune) throws URISyntaxException {
	log.debug("-- REST request to create Commune : {}", commune);
	Commune createdCommune = communeService.create(commune);
	return new EntiteResult<Commune>(createdCommune, communeService.getStatus(), communeService.getMessages());
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<Commune> updateCommune(@Valid @RequestBody Commune commune) throws URISyntaxException {
	log.debug("REST request to update Commune : {}", commune);
	Commune updatedCommune = communeService.update(commune);
	return new EntiteResult<Commune>(updatedCommune, communeService.getStatus(), communeService.getMessages());
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<Commune> deleteCommune(@PathVariable Long id) {
	log.debug("REST request to delete Commune : {}", id);
	communeService.delete(id);
	return new EntiteResult<Commune>(null, communeService.getStatus(), communeService.getMessages());
    }
}
