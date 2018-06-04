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

import fr.lcornithologie.basenaturaliste.model.EstimationNombre;
import fr.lcornithologie.basenaturaliste.page.EntiteResult;
import fr.lcornithologie.basenaturaliste.service.EstimationNombreService;

@RestController
@RequestMapping("/api/estimation-nombre")
public class EstimationNombreController {

    private final Logger log = LoggerFactory.getLogger(EstimationNombreController.class);

    @Autowired
    private EstimationNombreService estimationNombreService;

    @RequestMapping(value = "/all", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<EstimationNombre> getAllEstimationsNombre() {
	log.debug("REST request to get all Estimations Nombre");
	return estimationNombreService.findAll();
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public EntiteResult<EstimationNombre> createEstimationNombre(@Valid @RequestBody EstimationNombre estimationNombre)
	    throws URISyntaxException {
	log.debug("-- REST request to create EstimationNombre : {}", estimationNombre);
	EstimationNombre createdEstimationNombre = estimationNombreService.create(estimationNombre);
	return new EntiteResult<EstimationNombre>(createdEstimationNombre, estimationNombreService.getStatus(),
		estimationNombreService.getMessages());
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<EstimationNombre> updateEstimationNombre(@Valid @RequestBody EstimationNombre estimationNombre)
	    throws URISyntaxException {
	log.debug("REST request to update EstimationNombre : {}", estimationNombre);
	EstimationNombre updatedEstimationNombre = estimationNombreService.update(estimationNombre);
	return new EntiteResult<EstimationNombre>(updatedEstimationNombre, estimationNombreService.getStatus(),
		estimationNombreService.getMessages());
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<EstimationNombre> deleteEstimationNombre(@PathVariable Long id) {
	log.debug("REST request to delete EstimationNombre : {}", id);
	estimationNombreService.delete(id);
	return new EntiteResult<EstimationNombre>(null, estimationNombreService.getStatus(),
		estimationNombreService.getMessages());
    }
}
