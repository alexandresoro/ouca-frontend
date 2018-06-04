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

import fr.lcornithologie.basenaturaliste.model.Classe;
import fr.lcornithologie.basenaturaliste.page.EntiteResult;
import fr.lcornithologie.basenaturaliste.service.ClasseService;

@RestController
@RequestMapping("/api/classe")
public class ClasseController {

    private final Logger log = LoggerFactory.getLogger(ClasseController.class);

    @Autowired
    private ClasseService classeService;

    @RequestMapping(value = "/all", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Classe> getAllClasses() {
	log.debug("REST request to get all Classes");
	return classeService.findAll();
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public EntiteResult<Classe> createClasse(@Valid @RequestBody Classe classe) throws URISyntaxException {
	log.debug("-- REST request to create Classe : {}", classe);
	Classe createdClasse = classeService.create(classe);
	return new EntiteResult<Classe>(createdClasse, classeService.getStatus(), classeService.getMessages());
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<Classe> updateClasse(@Valid @RequestBody Classe classe) throws URISyntaxException {
	log.debug("REST request to update Classe : {}", classe);
	Classe updatedClasse = classeService.update(classe);
	return new EntiteResult<Classe>(updatedClasse, classeService.getStatus(), classeService.getMessages());
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntiteResult<Classe> deleteClasse(@PathVariable Long id) {
	log.debug("REST request to delete Classe : {}", id);
	classeService.delete(id);
	return new EntiteResult<Classe>(null, classeService.getStatus(), classeService.getMessages());
    }
}
