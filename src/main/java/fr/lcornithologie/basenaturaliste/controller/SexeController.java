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

import fr.lcornithologie.basenaturaliste.model.Sexe;
import fr.lcornithologie.basenaturaliste.page.EntiteResult;
import fr.lcornithologie.basenaturaliste.service.SexeService;

@RestController
@RequestMapping("/api/sexe")
public class SexeController {

    private final Logger log = LoggerFactory.getLogger(SexeController.class);

    @Autowired
    private SexeService sexeService;

    @RequestMapping(value = "/all", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Sexe> getAllSexes() {
	log.debug("REST request to get all Sexes");
	return sexeService.findAll();
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public EntiteResult<Sexe> createSexe(@Valid @RequestBody Sexe sexe) throws URISyntaxException {
	log.debug("-- REST request to create Sexe : {}", sexe);
	Sexe createdSexe = sexeService.create(sexe);
	return new EntiteResult<Sexe>(createdSexe, sexeService.getStatus(), sexeService.getMessages());
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<Sexe> updateSexe(@Valid @RequestBody Sexe sexe) throws URISyntaxException {
	log.debug("REST request to update Sexe : {}", sexe);
	Sexe updatedSexe = sexeService.update(sexe);
	return new EntiteResult<Sexe>(updatedSexe, sexeService.getStatus(), sexeService.getMessages());
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<Sexe> deleteSexe(@PathVariable Long id) {
	log.debug("REST request to delete Sexe : {}", id);
	sexeService.delete(id);
	return new EntiteResult<Sexe>(null, sexeService.getStatus(), sexeService.getMessages());
    }
}
