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

import fr.lcornithologie.basenaturaliste.model.Age;
import fr.lcornithologie.basenaturaliste.page.EntiteResult;
import fr.lcornithologie.basenaturaliste.service.AgeService;

@RestController
@RequestMapping("/api/age")
public class AgeController {

    private final Logger log = LoggerFactory.getLogger(AgeController.class);

    @Autowired
    private AgeService ageService;

    @RequestMapping(value = "/all", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Age> getAllAges() {
	log.debug("REST request to get all Ages");
	List<Age> ages = ageService.findAll();
	return ages;
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public EntiteResult<Age> createAge(@Valid @RequestBody Age age) throws URISyntaxException {
	log.debug("-- REST request to create Age : {}", age);
	Age createdAge = ageService.create(age);
	return new EntiteResult<Age>(createdAge, ageService.getStatus(), ageService.getMessages());
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<Age> updateAge(@Valid @RequestBody Age age) throws URISyntaxException {
	log.debug("REST request to update Age : {}", age);
	Age updatedAge = ageService.update(age);
	return new EntiteResult<Age>(updatedAge, ageService.getStatus(), ageService.getMessages());
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<Age> deleteAge(@PathVariable Long id) {
	log.debug("REST request to delete Age : {}", id);
	ageService.delete(id);
	return new EntiteResult<Age>(null, ageService.getStatus(), ageService.getMessages());
    }

}
