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

import fr.lcornithologie.basenaturaliste.model.Departement;
import fr.lcornithologie.basenaturaliste.page.EntiteResult;
import fr.lcornithologie.basenaturaliste.service.DepartementService;

@RestController
@RequestMapping("/api/departement")
public class DepartementController {

    private final Logger log = LoggerFactory.getLogger(DepartementController.class);

    @Autowired
    private DepartementService departementService;

    @RequestMapping(value = "/all", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Departement> getAllDepartements() {
	log.debug("REST request to get all Departements");
	return departementService.findAll();
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public EntiteResult<Departement> createDepartement(@Valid @RequestBody Departement departement)
	    throws URISyntaxException {
	log.debug("-- REST request to create Departement : {}", departement);
	Departement createdDepartement = departementService.create(departement);
	return new EntiteResult<Departement>(createdDepartement, departementService.getStatus(),
		departementService.getMessages());
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<Departement> updateDepartement(@Valid @RequestBody Departement departement)
	    throws URISyntaxException {
	log.debug("REST request to update Departement : {}", departement);
	Departement updatedDepartement = departementService.update(departement);
	return new EntiteResult<Departement>(updatedDepartement, departementService.getStatus(),
		departementService.getMessages());
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<Departement> deleteDepartement(@PathVariable Long id) {
	log.debug("REST request to delete Departement : {}", id);
	departementService.delete(id);
	return new EntiteResult<Departement>(null, departementService.getStatus(), departementService.getMessages());
    }
}
