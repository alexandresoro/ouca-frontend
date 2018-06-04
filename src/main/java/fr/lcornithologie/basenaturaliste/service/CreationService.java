package fr.lcornithologie.basenaturaliste.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.lcornithologie.basenaturaliste.model.Donnee;
import fr.lcornithologie.basenaturaliste.model.Inventaire;
import fr.lcornithologie.basenaturaliste.page.CreationPage;
import fr.lcornithologie.basenaturaliste.page.EntiteResult;
import fr.lcornithologie.basenaturaliste.page.PreviousAndNextDonnee;

@Service
@Transactional
public class CreationService {

    @Autowired
    ObservateurService observateurService;

    @Autowired
    DepartementService departementService;

    @Autowired
    CommuneService communeService;

    @Autowired
    LieuditService lieuditService;

    @Autowired
    MeteoService meteoService;

    @Autowired
    ClasseService classeService;

    @Autowired
    EspeceService especeService;

    @Autowired
    AgeService ageService;

    @Autowired
    SexeService sexeService;

    @Autowired
    EstimationNombreService estimationNombreService;

    @Autowired
    EstimationDistanceService estimationDistanceService;

    @Autowired
    ComportementService comportementService;

    @Autowired
    MilieuService milieuService;

    @Autowired
    InventaireService inventaireService;

    @Autowired
    DonneeService donneeService;

    @Autowired
    ConfigurationService configurationService;

    public CreationPage initCreationPage() {
        CreationPage creationPage = new CreationPage();

        // Inventaire
        creationPage.setObservateurs(observateurService.findAll());

        creationPage.setDepartements(departementService.findAll());
        creationPage.setCommunes(communeService.findAll());
        creationPage.setLieudits(lieuditService.findAll());

        creationPage.setMeteos(meteoService.findAll());

        // Default values
        creationPage.setDefaultObservateur(configurationService.getDefaultObservateur());
        creationPage.setDefaultDate(new Date());
        creationPage.setDefaultDepartement(configurationService.getDefaultDepartement());
        creationPage.setIsMeteoDisplayed(configurationService.isMeteoDisplayed());
        creationPage.setAreAssociesDisplayed(configurationService.areAssociesDisplayed());

        // Données
        creationPage.setClasses(classeService.findAll());
        creationPage.setEspeces(especeService.findAll());

        creationPage.setEstimationsNombre(estimationNombreService.findAll());
        creationPage.setEstimationsDistance(estimationDistanceService.findAll());

        creationPage.setSexes(sexeService.findAll());
        creationPage.setAges(ageService.findAll());

        creationPage.setComportements(comportementService.findAll());
        creationPage.setMilieux(milieuService.findAll());

        // Default values
        creationPage.setDefaultEstimationNombre(configurationService.getDefaultEstimationNombre());
        creationPage.setDefaultNombre(configurationService.getDefaultNombre());

        creationPage.setDefaultAge(configurationService.getDefaultAge());
        creationPage.setDefaultSexe(configurationService.getDefaultSexe());

        creationPage.setIsDistanceDisplayed(configurationService.isDistanceDisplayed());
        creationPage.setIsRegroupementDisplayed(configurationService.isRegroupementDisplayed());

        creationPage.setNumberOfDonnees(donneeService.getNumberOfDonnees());

        creationPage.setLastDonnee(donneeService.getLastDonnee());

        creationPage.setNextRegroupement(getNextRegroupement());

        return creationPage;
    }

    public int getNextRegroupement() {
        return donneeService.getNextRegroupement();
    }

    public EntiteResult<Inventaire> createInventaire(Inventaire inventaire) {
        Inventaire createdInventaire = inventaireService.create(inventaire);
        return new EntiteResult<Inventaire>(createdInventaire, inventaireService.getStatus(),
                inventaireService.getMessages());
    }

    public EntiteResult<Donnee> createDonnee(Donnee donnee) {
        Donnee createdDonnee = donneeService.create(donnee);
        return new EntiteResult<Donnee>(createdDonnee, donneeService.getStatus(), donneeService.getMessages());
    }

    public EntiteResult<Donnee> updateDonnee(Donnee donnee) {
        return null;
    }

    public EntiteResult<Donnee> deleteDonnee(long id) {
        donneeService.delete(id);

        return new EntiteResult<Donnee>(null, donneeService.getStatus(), donneeService.getMessages());
    }

    public PreviousAndNextDonnee getPreviousAndNextDonnee(long id) {
        Donnee previousDonnee = donneeService.getPreviousDonneeById(id);
        Donnee nextDonnee = donneeService.getNextDonneeById(id);

        return new PreviousAndNextDonnee(previousDonnee, nextDonnee);
    }

    public Donnee getPreviousDonnee(long id) {
        return donneeService.getPreviousDonneeById(id);
    }

    public Donnee getNextDonnee(long id) {
        return donneeService.getNextDonneeById(id);
    }

}
