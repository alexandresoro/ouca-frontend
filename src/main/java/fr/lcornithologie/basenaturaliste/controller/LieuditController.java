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

import fr.lcornithologie.basenaturaliste.model.Lieudit;
import fr.lcornithologie.basenaturaliste.page.EntiteResult;
import fr.lcornithologie.basenaturaliste.service.LieuditService;

@RestController
@RequestMapping("/api/lieudit")
public class LieuditController {

    private final Logger log = LoggerFactory.getLogger(LieuditController.class);

    @Autowired
    private LieuditService lieuditService;

    @RequestMapping(value = "/all", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Lieudit> getAllLieuxdits() {
	log.debug("REST request to get all Lieuxdits");
	return lieuditService.findAll();
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public EntiteResult<Lieudit> createLieudit(@Valid @RequestBody Lieudit lieudit) throws URISyntaxException {
	log.debug("-- REST request to create Lieudit : {}", lieudit);
	Lieudit createdLieudit = lieuditService.create(lieudit);
	return new EntiteResult<Lieudit>(createdLieudit, lieuditService.getStatus(), lieuditService.getMessages());
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<Lieudit> updateLieudit(@Valid @RequestBody Lieudit lieudit) throws URISyntaxException {
	log.debug("REST request to update Lieudit : {}", lieudit);
	Lieudit updatedLieudit = lieuditService.update(lieudit);
	return new EntiteResult<Lieudit>(updatedLieudit, lieuditService.getStatus(), lieuditService.getMessages());
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<Lieudit> deleteLieudit(@PathVariable Long id) {
	log.debug("REST request to delete Lieudit : {}", id);
	lieuditService.delete(id);
	return new EntiteResult<Lieudit>(null, lieuditService.getStatus(), lieuditService.getMessages());
    }
}
