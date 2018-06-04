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

import fr.lcornithologie.basenaturaliste.model.EstimationDistance;
import fr.lcornithologie.basenaturaliste.page.EntiteResult;
import fr.lcornithologie.basenaturaliste.service.EstimationDistanceService;

@RestController
@RequestMapping("/api/estimation-distance")
public class EstimationDistanceController {

    private final Logger log = LoggerFactory.getLogger(EstimationDistanceController.class);

    @Autowired
    private EstimationDistanceService estimationDistanceService;

    @RequestMapping(value = "/all", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<EstimationDistance> getAllEstimationsDistance() {
	log.debug("REST request to get all Estimations Distance");
	return estimationDistanceService.findAll();
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public EntiteResult<EstimationDistance> createEstimationDistance(
	    @Valid @RequestBody EstimationDistance estimationDistance) throws URISyntaxException {
	log.debug("-- REST request to create EstimationDistance : {}", estimationDistance);
	EstimationDistance createdEstimationDistance = estimationDistanceService.create(estimationDistance);
	return new EntiteResult<EstimationDistance>(createdEstimationDistance, estimationDistanceService.getStatus(),
		estimationDistanceService.getMessages());
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<EstimationDistance> updateEstimationDistance(
	    @Valid @RequestBody EstimationDistance estimationDistance) throws URISyntaxException {
	log.debug("REST request to update EstimationDistance : {}", estimationDistance);
	EstimationDistance updatedEstimationDistance = estimationDistanceService.update(estimationDistance);
	return new EntiteResult<EstimationDistance>(updatedEstimationDistance, estimationDistanceService.getStatus(),
		estimationDistanceService.getMessages());
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<EstimationDistance> deleteEstimationDistance(@PathVariable Long id) {
	log.debug("REST request to delete EstimationDistance : {}", id);
	estimationDistanceService.delete(id);
	return new EntiteResult<EstimationDistance>(null, estimationDistanceService.getStatus(),
		estimationDistanceService.getMessages());
    }
}
