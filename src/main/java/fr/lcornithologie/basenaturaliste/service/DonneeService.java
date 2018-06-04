package fr.lcornithologie.basenaturaliste.service;

import java.sql.Timestamp;
import java.util.Set;

import javax.persistence.Query;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import fr.lcornithologie.basenaturaliste.model.Age;
import fr.lcornithologie.basenaturaliste.model.Comportement;
import fr.lcornithologie.basenaturaliste.model.Donnee;
import fr.lcornithologie.basenaturaliste.model.Espece;
import fr.lcornithologie.basenaturaliste.model.EstimationDistance;
import fr.lcornithologie.basenaturaliste.model.EstimationNombre;
import fr.lcornithologie.basenaturaliste.model.Inventaire;
import fr.lcornithologie.basenaturaliste.model.Milieu;
import fr.lcornithologie.basenaturaliste.model.Sexe;
import fr.lcornithologie.basenaturaliste.repository.DonneeRepository;

@Service
@Transactional
public class DonneeService extends EntiteSimpleService<Donnee> {

	private final Logger log = LoggerFactory.getLogger(DonneeService.class);

	@Autowired
	private InventaireService inventaireService;

	@Autowired
	private DonneeRepository donneeRepository;

	@Override
	protected DonneeRepository getRepository() {
		return donneeRepository;
	}

	@Override
	protected Donnee getNewObject() {
		return new Donnee();
	}

	@Override
	protected String getEntityName() {
		return Donnee.ENTITY_NAME;
	}

	@Override
	public Donnee create(Donnee donneeToCreate) {
		Donnee createdDonnee = null;

		if (donneeToCreate != null) {
			// Check if Inventaire exists and create it if not
			Inventaire inventaire = donneeToCreate.getInventaire();
			if (inventaire != null && inventaire.getId() == null) {
				donneeToCreate.setInventaire(inventaireService.create(inventaire));
			}

			donneeToCreate.setDateCreation(new Timestamp(System.currentTimeMillis()));
			createdDonnee = super.create(donneeToCreate);

		}

		return createdDonnee;
	}

	@Override
	public Donnee update(Donnee donneeToUpdate) {
		Donnee updatedDonnee = null;

		if (donneeToUpdate != null) {
			updatedDonnee = super.update(donneeToUpdate);
		}

		return updatedDonnee;
	}

	@Override
	public boolean delete(Long id) {
		Donnee donnee = donneeRepository.findOne(id);

		boolean isDonneeDeleted = super.delete(id);

		if (isDonneeDeleted) {
			int nbOfDonneesOfInventaire = donneeRepository.countDonneesByInventaire(donnee.getInventaire().getId());
			if (nbOfDonneesOfInventaire == 0) {
				inventaireService.delete(donnee.getInventaire().getId());
			}
		}

		return isDonneeDeleted;
	}

	public long getNumberOfDonnees() {
		return donneeRepository.count();
	}

	public Donnee getLastDonnee() {
		return donneeRepository.findFirstByOrderByIdDesc();
	}

	public Donnee getPreviousDonneeById(long nextId) {
		return donneeRepository.findFirstByIdLessThanOrderByIdDesc(nextId);
	}

	public Donnee getNextDonneeById(long previousId) {
		return donneeRepository.findFirstByIdGreaterThanOrderByIdAsc(previousId);
	}

	public int getNextRegroupement() {
		int regroupement = 1;
		Integer maxRegroupement = donneeRepository.findLastRegroupement();
		if (maxRegroupement != null) {
			regroupement = maxRegroupement + 1;
		}
		return regroupement;
	}

	@Override
	protected boolean isValid(Donnee donnee) {
		return isInventaireValid(donnee.getInventaire()) && isEspeceValid(donnee.getEspece())
				&& isAgeValid(donnee.getAge()) && isSexeValid(donnee.getSexe())
				&& isEstimationNombreValid(donnee.getEstimationNombre())
				&& isNombreValid(donnee.getNombre(), donnee.getEstimationNombre())
				&& areComportementsValid(donnee.getComportements()) && areMilieuxValid(donnee.getMilieux())
				&& isCommentaireValid(donnee.getCommentaire())
				&& isEstimationDistanceValid(donnee.getEstimationDistance())
				&& isDistanceValid(donnee.getDistance(), donnee.getEstimationDistance())
				&& isRegroupementValid(donnee.getRegroupement());
	}

	private boolean isInventaireValid(Inventaire inventaire) {
		boolean isValid = inventaire != null && inventaire.getId() != null;

		if (!isValid) {
			log.error("-- Inventaire of Donnée cannot be null");
			addErrorMessage(getMissingInventaireMessage());
		}

		return isValid;
	}

	private boolean isEspeceValid(Espece espece) {
		boolean isValid = espece != null && espece.getId() != null;

		if (!isValid) {
			log.error("-- Espèce of Donnée cannot be null");
			addErrorMessage(getMissingEspeceMessage());
		}

		return isValid;
	}

	private boolean isAgeValid(Age age) {
		boolean isValid = age != null && age.getId() != null;

		if (!isValid) {
			log.error("-- Age of Donnée cannot be null");
			addErrorMessage(getMissingAgeMessage());
		}

		return isValid;
	}

	private boolean isSexeValid(Sexe sexe) {
		boolean isValid = sexe != null && sexe.getId() != null;

		if (!isValid) {
			log.error("-- Sexe of Donnée cannot be null");
			addErrorMessage(getMissingSexeMessage());
		}

		return isValid;
	}

	private boolean isEstimationNombreValid(EstimationNombre estimationNombre) {
		boolean isValid = estimationNombre != null && estimationNombre.getId() != null;

		if (!isValid) {
			log.error("-- Estimation nombre of Donnée cannot be null");
			addErrorMessage(getMissingEstimationNombreMessage());
		}

		return isValid;
	}

	private boolean isNombreValid(Integer nombre, EstimationNombre estimationNombre) {
		boolean isValid = true;

		if (estimationNombre.isNonCompte() && nombre != null) {
			isValid = false;
			log.error("-- If estimation nombre is Non Compté then nombre of Donnée should be null: {0}", nombre);
			addErrorMessage(getInvalidNombreNonCompteMessage());

		} else if (!estimationNombre.isNonCompte() && (nombre == null || nombre <= 0)) {
			isValid = false;
			log.error("-- Nombre of Donnée should be an integer > 0: {0}", nombre);
			addErrorMessage(getInvalidNombreMessage());
		}

		return isValid;
	}

	private boolean areComportementsValid(Set<Comportement> comportements) {
		boolean areComportementsValid = true;

		for (Comportement comportement : comportements) {
			if (areComportementsValid && !isComportementValid(comportement)) {
				areComportementsValid = false;
			}
		}

		return areComportementsValid;
	}

	private boolean isComportementValid(Comportement comportement) {
		boolean isValid = comportement != null && comportement.getId() != null;

		if (!isValid) {
			log.error("-- Comportement of Donnée cannot be null");
			addErrorMessage(getMissingComportementMessage());
		}

		return isValid;
	}

	private boolean areMilieuxValid(Set<Milieu> milieux) {
		boolean areMilieuxValid = true;

		for (Milieu milieu : milieux) {
			if (areMilieuxValid && !isMilieuValid(milieu)) {
				areMilieuxValid = false;
			}
		}

		return areMilieuxValid;
	}

	private boolean isMilieuValid(Milieu milieu) {
		boolean isValid = milieu != null && milieu.getId() != null;

		if (!isValid) {
			log.error("-- Milieu of Donnée cannot be null");
			addErrorMessage(getMissingMilieuMessage());
		}

		return isValid;
	}

	private boolean isCommentaireValid(String commentaire) {
		// TODO remove forbidden characters
		return true;
	}

	private boolean isEstimationDistanceValid(EstimationDistance estimationDistance) {
		boolean isValid = estimationDistance == null || estimationDistance.getId() != null;

		if (!isValid) {
			log.error("-- Estimation Distance of Donnée should have an ID: {0}", estimationDistance);
			addErrorMessage(getMissingEstimationDistanceMessage());
		}

		return isValid;
	}

	private boolean isDistanceValid(Integer distance, EstimationDistance estimationDistance) {
		boolean isValid = true;

		if (estimationDistance == null && distance != null) {
			isValid = false;
			log.error("-- If Estimation Distance is null then Distance of Donnée should be null: {0}", distance);
			addErrorMessage(getInvalidDistanceWithoutEstimationMessage());

		} else if (estimationDistance != null && (distance == null || distance < 0)) {
			isValid = false;
			log.error("-- Distance of Donnée should be an integer >= 0: {0}", distance);
			addErrorMessage(getInvalidDistanceMessage());
		}

		return isValid;
	}

	private boolean isRegroupementValid(Integer regroupement) {
		boolean isValid = regroupement == null || regroupement > 0;

		if (!isValid) {
			log.error("-- Regroupement of Donnée should be an integer >0: {0}", regroupement);
			addErrorMessage(getInvalidRegroupementMessage());
		}

		return isValid;
	}

	@Override
	protected boolean isNew(Donnee donnee) {
		return true;
	}

	private String createFilteringQuery(Filter filter) {
		// "select donnee from Donnee donnee left join fetch
		// donnee.comportements left join fetch donnee.milieux where donnee.id
		// =:id")
		Query query = null;// TODO

		String conditions = "";

		if (filter.getId() != null) {
			conditions += and(conditions) + "d.id= :id";
			query.setParameter("id", filter.getId());
		}

		if (filter.getEspece() != null) {
			conditions += and(conditions) + "d.espece_id= :espece";
			query.setParameter("espece", filter.getEspece().getId());

		} else if (filter.getClasse() != null) {
			// conditions += and(conditions) + "d.classe_id= :classe";
			// query.setParameter("classe", filter.getClasse().getId());
		}

		if (filter.getLieudit() != null) {
			conditions += and(conditions) + "d.lieudit.id= :lieudit";
			query.setParameter("lieudit", filter.getLieudit().getId());

		} else if (filter.getCommune() != null) {
			conditions += and(conditions) + "d.commune= :lieudit";
			query.setParameter("lieudit", filter.getLieudit().getId());

		} else if (filter.getDepartement() != null) {
			conditions += and(conditions) + "d.lieudit_id= :lieudit";
			query.setParameter("lieudit", filter.getLieudit().getId());

		}

		if (filter.getStartDate() != null) {

		}

		if (filter.getEndDate() != null) {

		}

		String queryStr = "select d from Donnee d";

		if (!StringUtils.isEmpty(conditions)) {
			queryStr += " where " + conditions;
		}

		return queryStr;
	}

	private String and(String conditions) {
		if (!StringUtils.isEmpty(conditions)) {
			return " AND ";
		}
		return "";
	}

	@Override
	protected String getAlreadyExistsMessage() {
		return "Cette donnée existe déjà.";
	}

	@Override
	protected String getCreationSuccessMessage() {
		return "La donnée a été créée avec succès.";
	}

	@Override
	protected String getCreationErrorMessage() {
		return "La donnée n'a pas pu être créée.";
	}

	@Override
	protected String getUpdateSuccessMessage() {
		return "La donnée a été modifiée avec succès.";
	}

	@Override
	protected String getUpdateErrorMessage() {
		return "La donnée n'a pas pu être modifiée.";
	}

	@Override
	protected String getRemoveSuccessMessage() {
		return "La donnée a été supprimée avec succès.";
	}

	@Override
	protected String getRemoveErrorMessage() {
		return "La donnée n'a pas pu être supprimée.";
	}

	@Override
	protected String getDoesNotExistMessage() {
		return "La donnée à modifier ou supprimer n'a pas été trouvée.";
	}

	private String getMissingInventaireMessage() {
		return "Aucun inventaire n'a été trouvé pour cette donnée. Veuillez créer un inventaire.";
	}

	private String getMissingEspeceMessage() {
		return "Aucune espèce n'a été spécifiée pour cette donnée. Veuillez choisir une espèce existante.";
	}

	private String getMissingSexeMessage() {
		return "Aucun sexe n'a été spécifié pour cette donnée. Veuillez choisir un sexe existant.";
	}

	private String getMissingAgeMessage() {
		return "Aucun âge n'a été spécifié pour cette donnée. Veuillez choisir un âge existant.";
	}

	private String getMissingEstimationNombreMessage() {
		return "Aucune estimation du nombre n'a été spécifiée pour cette donnée. Veuillez choisir une estimation du nombre existante.";
	}

	private String getInvalidNombreNonCompteMessage() {
		return "Quand l'estimation du nombre est de type \"Non compté\" le champ nombre doit être vide.";
	}

	private String getInvalidNombreMessage() {
		return "Le nombre doit être un entier strictement supérieur à 0. Veuillez vérifier le nombre spécifié.";
	}

	private String getMissingComportementMessage() {
		return "L'un des comportements sélectionnés n'a pas été trouvé. Veuillez choisir un comportement existant.";
	}

	private String getMissingMilieuMessage() {
		return "L'un des milieux sélectionnés n'a pas été trouvé. Veuillez choisir un milieu existant.";
	}

	private String getMissingEstimationDistanceMessage() {
		return "L'estimation de distance sélectionnée n'a pas été trouvée. Veuillez choisir une estimation de distance existante.";
	}

	private String getInvalidDistanceWithoutEstimationMessage() {
		return "Quand l'estimation de la distance n'est pas spécifiée le champ distance doit être vide. Veuillez vérifier la valeur de la distance.";
	}

	private String getInvalidDistanceMessage() {
		return "La distance doit être un entier supérieur ou égal à 0. Veuillez vérifier la distance spécifiée.";
	}

	private String getInvalidRegroupementMessage() {
		return "Le numéro de regroupement doit être un entier strictement supérieur à 0. Veuillez vérifier le numéro de regroupement spécifié.";
	}
}
