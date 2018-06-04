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

import fr.lcornithologie.basenaturaliste.model.Milieu;
import fr.lcornithologie.basenaturaliste.page.EntiteResult;
import fr.lcornithologie.basenaturaliste.service.MilieuService;

@RestController
@RequestMapping("/api/milieu")
public class MilieuController {

    private final Logger log = LoggerFactory.getLogger(MilieuController.class);

    @Autowired
    private MilieuService milieuService;

    @RequestMapping(value = "/all", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Milieu> getAllMilieux() {
	log.debug("REST request to get all Milieux");
	return milieuService.findAll();
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public EntiteResult<Milieu> createMilieu(@Valid @RequestBody Milieu milieu) throws URISyntaxException {
	log.debug("-- REST request to create Milieu : {}", milieu);
	Milieu createdMilieu = milieuService.create(milieu);
	return new EntiteResult<Milieu>(createdMilieu, milieuService.getStatus(), milieuService.getMessages());
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<Milieu> updateMilieu(@Valid @RequestBody Milieu milieu) throws URISyntaxException {
	log.debug("REST request to update Milieu : {}", milieu);
	Milieu updatedMilieu = milieuService.update(milieu);
	return new EntiteResult<Milieu>(updatedMilieu, milieuService.getStatus(), milieuService.getMessages());
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<Milieu> deleteMilieu(@PathVariable Long id) {
	log.debug("REST request to delete Milieu : {}", id);
	milieuService.delete(id);
	return new EntiteResult<Milieu>(null, milieuService.getStatus(), milieuService.getMessages());
    }
}
