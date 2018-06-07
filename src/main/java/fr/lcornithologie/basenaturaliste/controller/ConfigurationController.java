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
import fr.lcornithologie.basenaturaliste.model.AppConfiguration;
import fr.lcornithologie.basenaturaliste.model.Sexe;
import fr.lcornithologie.basenaturaliste.page.ConfigurationPage;
import fr.lcornithologie.basenaturaliste.page.EntiteResult;
import fr.lcornithologie.basenaturaliste.service.ConfigurationService;
import fr.lcornithologie.basenaturaliste.service.SexeService;

@RestController
@RequestMapping("/api/configuration")
public class ConfigurationController {

        private final Logger log = LoggerFactory.getLogger(ConfigurationController.class);

        @Autowired
        private ConfigurationService configurationService;

        @RequestMapping(value = "/init", method = RequestMethod.GET,
                        produces = MediaType.APPLICATION_JSON_VALUE)
        public ConfigurationPage getPageModel() {
                log.debug("REST request to get the configuration page model");
                return configurationService.getConfigurationPage();
        }


        @RequestMapping(value = "/update", method = RequestMethod.POST,
                        produces = MediaType.APPLICATION_JSON_VALUE)
        public AppConfiguration updateAppConfiguration(
                        @Valid @RequestBody AppConfiguration appConfiguration)
                        throws URISyntaxException {
                log.debug("REST request to update AppConfiguration : {}", appConfiguration);
                // Sexe updatedSexe = sexeService.update(sexe);
                // return new EntiteResult<Sexe>(updatedSexe, sexeService.getStatus(),
                // sexeService.getMessages());
                return null;
        }

}
