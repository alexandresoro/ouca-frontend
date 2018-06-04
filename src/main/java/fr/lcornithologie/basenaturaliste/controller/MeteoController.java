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

import fr.lcornithologie.basenaturaliste.model.Meteo;
import fr.lcornithologie.basenaturaliste.page.EntiteResult;
import fr.lcornithologie.basenaturaliste.service.MeteoService;

@RestController
@RequestMapping("/api/meteo")
public class MeteoController {

    private final Logger log = LoggerFactory.getLogger(MeteoController.class);

    @Autowired
    private MeteoService meteoService;

    @RequestMapping(value = "/all", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Meteo> getAllMeteos() {
	log.debug("REST request to get all Meteos");
	return meteoService.findAll();
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public EntiteResult<Meteo> createMeteo(@Valid @RequestBody Meteo meteo) throws URISyntaxException {
	log.debug("-- REST request to create Meteo : {}", meteo);
	Meteo createdMeteo = meteoService.create(meteo);
	return new EntiteResult<Meteo>(createdMeteo, meteoService.getStatus(), meteoService.getMessages());
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<Meteo> updateMeteo(@Valid @RequestBody Meteo meteo) throws URISyntaxException {
	log.debug("REST request to update Meteo : {}", meteo);
	Meteo updatedMeteo = meteoService.update(meteo);
	return new EntiteResult<Meteo>(updatedMeteo, meteoService.getStatus(), meteoService.getMessages());
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<Meteo> deleteMeteo(@PathVariable Long id) {
	log.debug("REST request to delete Meteo : {}", id);
	meteoService.delete(id);
	return new EntiteResult<Meteo>(null, meteoService.getStatus(), meteoService.getMessages());
    }
}
