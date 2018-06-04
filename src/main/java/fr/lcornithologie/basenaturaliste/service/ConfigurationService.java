package fr.lcornithologie.basenaturaliste.service;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.lcornithologie.basenaturaliste.model.Age;
import fr.lcornithologie.basenaturaliste.model.Configuration;
import fr.lcornithologie.basenaturaliste.model.Departement;
import fr.lcornithologie.basenaturaliste.model.EstimationNombre;
import fr.lcornithologie.basenaturaliste.model.Observateur;
import fr.lcornithologie.basenaturaliste.model.Sexe;
import fr.lcornithologie.basenaturaliste.repository.ConfigurationRepository;
import fr.lcornithologie.basenaturaliste.repository.EntiteSimpleRepository;

@Service
@Transactional
public class ConfigurationService extends EntiteSimpleService<Configuration> {


    private static String DEFAULT_OBSERVATEUR = "observateur";
    private static String DEFAULT_DEPARTEMENT = "departement";
    private static String DEFAULT_AGE = "age";
    private static String DEFAULT_SEXE = "sexe";
    private static String DEFAULT_ESTIMATION_NOMBRE = "estimation_nombre";
    private static String DEFAULT_NOMBRE = "nombre";

    private static String ARE_ASSOCIES_DISPLAYED = "are_associes_displayed";
    private static String IS_METEO_DISPLAYED = "is_meteo_displayed";
    private static String IS_DISTANCE_DISPLAYED = "is_distance_displayed";
    private static String IS_REGROUPEMENT_DISPLAYED = "is_regroupement_displayed";

    private final Logger log = LoggerFactory.getLogger(ConfigurationService.class);

    @Autowired
    private ConfigurationRepository configurationRepository;

    @Autowired
    private ObservateurService observateurService;

    @Autowired
    private DepartementService departementService;

    @Autowired
    private AgeService ageService;

    @Autowired
    private SexeService sexeService;

    @Autowired
    private EstimationNombreService estimationNombreService;

    public Observateur getDefaultObservateur() {
        long id = getConfigAsLong(DEFAULT_OBSERVATEUR);
        return observateurService.findById(id);
    }

    public Departement getDefaultDepartement() {
        long id = getConfigAsLong(DEFAULT_DEPARTEMENT);
        return departementService.findById(id);
    }

    public boolean areAssociesDisplayed() {
        return getConfigAsBoolean(ARE_ASSOCIES_DISPLAYED);
    }

    public boolean isMeteoDisplayed() {
        return getConfigAsBoolean(IS_METEO_DISPLAYED);
    }

    public Age getDefaultAge() {
        long id = getConfigAsLong(DEFAULT_AGE);
        return ageService.findById(id);
    }

    public Sexe getDefaultSexe() {
        long id = getConfigAsLong(DEFAULT_SEXE);
        return sexeService.findById(id);
    }

    public EstimationNombre getDefaultEstimationNombre() {
        long id = getConfigAsLong(DEFAULT_ESTIMATION_NOMBRE);
        return estimationNombreService.findById(id);
    }

    public Integer getDefaultNombre() {
        return getConfigAsInteger(DEFAULT_NOMBRE);
    }

    public boolean isDistanceDisplayed() {
        return getConfigAsBoolean(IS_DISTANCE_DISPLAYED);
    }

    public boolean isRegroupementDisplayed() {
        return getConfigAsBoolean(IS_REGROUPEMENT_DISPLAYED);
    }

    private long getConfigAsLong(String configName) {
        long result = 0;

        Configuration config = findConfigurationByName(configName);
        if (config != null) {
            try {
                result = Long.parseLong(config.getValue());
            } catch (NumberFormatException e) {
                log.error(config.getValue() + " cannot be converted to a long.");
                e.printStackTrace();
            }
        }

        return result;
    }

    private boolean getConfigAsBoolean(String configName) {
        boolean result = false;

        Configuration config = findConfigurationByName(configName);
        if (config != null && config.getValue() == "1") {
            result = true;
        }

        return result;
    }

    private int getConfigAsInteger(String configName) {
        int result = 0;

        Configuration config = findConfigurationByName(configName);
        if (config != null) {
            try {
                result = Integer.parseInt(config.getValue());
            } catch (NumberFormatException e) {
                log.error(config.getValue() + " cannot be converted to an integer.");
                e.printStackTrace();
            }
        }

        return result;
    }

    @Override
    protected String getEntityName() {
        return Configuration.ENTITY_NAME;
    }

    @Override
    protected EntiteSimpleRepository<Configuration> getRepository() {
        return configurationRepository;
    }

    @Override
    protected Configuration getNewObject() {
        return new Configuration();
    }

    @Override
    protected boolean isNew(Configuration object) {
        // TODO Auto-generated method stub
        return true;
    }

    @Override
    protected boolean isValid(Configuration object) {
        // TODO Auto-generated method stub
        return true;
    }

    private Configuration findConfigurationByName(String name) {
        Configuration result = null;
        if (name != null) {
            Optional<Configuration> entity = configurationRepository.findOneByLibelle(name);
            if (entity.isPresent()) {
                result = entity.get();
            }
        }
        return result;
    }

    @Override
    protected String getAlreadyExistsMessage() {
        return null;
    }

    @Override
    protected String getCreationSuccessMessage() {
        return null;
    }

    @Override
    protected String getCreationErrorMessage() {
        return null;
    }

    @Override
    protected String getUpdateSuccessMessage() {
        return null;
    }

    @Override
    protected String getUpdateErrorMessage() {
        return null;
    }

    @Override
    protected String getRemoveSuccessMessage() {
        return null;
    }

    @Override
    protected String getRemoveErrorMessage() {
        return null;
    }

    @Override
    protected String getDoesNotExistMessage() {
        return null;
    }
}
