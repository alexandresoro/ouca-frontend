import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import {
  CoordinatesSystem,
  getCoordinates
} from "ouca-common/coordinates-system";
import { Departement } from "ouca-common/departement.object";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { UICommune } from "src/app/models/commune.model";
import { UILieudit } from "src/app/models/lieudit.model";
import { CrossFieldErrorMatcher } from "src/app/modules/shared/matchers/cross-field-error.matcher";
import { AppConfigurationService } from "src/app/services/app-configuration.service";
import { CoordinatesBuilderService } from "src/app/services/coordinates-builder.service";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { ListHelper } from "../../../../shared/helpers/list-helper";
import { EntitySubFormComponent } from "../entite-simple-form/entity-sub-form.component";

@Component({
  selector: "lieudit-form",
  styleUrls: ["./lieudit-form.component.scss"],
  templateUrl: "./lieudit-form.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LieuditFormComponent extends EntitySubFormComponent<UILieudit>
  implements OnInit {
  public departements$: Observable<Departement[]>;

  private communes$: Observable<UICommune[]>;

  public filteredCommunes$: Observable<UICommune[]>;

  private lieuditToDisplay$: BehaviorSubject<UILieudit> = new BehaviorSubject<
    UILieudit
  >(null);

  public areCoordinatesTransformed$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  public departementControl: FormControl;

  public nomCommuneControl: FormControl;

  public coordinatesSystem$: Observable<CoordinatesSystem>;

  public lieuditNomErrorStateMatcher = new CrossFieldErrorMatcher(
    "alreadyExistingNom"
  );

  constructor(
    private coordinatesBuilderService: CoordinatesBuilderService,
    private entitiesStoreService: EntitiesStoreService,
    private appConfigurationService: AppConfigurationService
  ) {
    super();

    this.departements$ = this.entitiesStoreService.getDepartements$();
    this.communes$ = this.entitiesStoreService.getCommunes$();
    this.coordinatesSystem$ = this.appConfigurationService.getAppCoordinatesSystem$();
  }

  ngOnInit(): void {
    // Create the additional controls
    this.departementControl = new FormControl("", [Validators.required]);
    this.nomCommuneControl = new FormControl("", [Validators.required]);

    // Filter the list of "Communes" depending on the selected "Département"
    this.filteredCommunes$ = this.getCommunesToDisplay$();

    // Keep the link between "Code commune" and "Nom commune"
    const codeCommuneControl = this.entityForm.controls.communeId;
    codeCommuneControl.valueChanges.subscribe((selectedCommuneId: number) => {
      this.nomCommuneControl.setValue(selectedCommuneId, {
        emitEvent: false
      });
    });
    this.nomCommuneControl.valueChanges.subscribe(
      (selectedCommuneId: number) => {
        codeCommuneControl.setValue(selectedCommuneId, {
          emitEvent: false
        });
      }
    );

    combineLatest(
      this.departements$,
      this.communes$,
      this.coordinatesSystem$,
      this.lieuditToDisplay$
    ).subscribe(([departements, communes, coordinatesSystem, lieudit]) => {
      console.log("Lieudit à afficher", lieudit);

      // Update the coordinates validators depending on the current coordinates system
      this.coordinatesBuilderService.updateCoordinatesValidators(
        coordinatesSystem.code,
        this.entityForm.controls.longitude,
        this.entityForm.controls.latitude
      );

      if (!lieudit?.id) {
        // this.entityForm.reset();
        this.departementControl.reset();
        this.nomCommuneControl.reset();
      } else {
        // Set the departement
        this.departementControl.setValue(
          ListHelper.findEntityInListByID(
            departements,
            lieudit.commune.departement.id
          )
        );

        // Set the commune
        // this.entityForm.controls.communeId.setValue(lieudit.commune.id);
        this.nomCommuneControl.setValue(lieudit.commune.id);

        // Set the coordinates
        const coordinates = getCoordinates(lieudit, coordinatesSystem.code);
        this.entityForm.controls.longitude.setValue(coordinates?.longitude);
        this.entityForm.controls.latitude.setValue(coordinates?.latitude);
        this.areCoordinatesTransformed$.next(coordinates.isTransformed);
      }
    });

    this.lieuditToDisplay$.next(this.entity?.id ? this.entity : null);
  }

  private getCommunesToDisplay$ = (): Observable<UICommune[]> => {
    return combineLatest(
      this.departementControl.valueChanges as Observable<Departement>,
      this.communes$,
      (selectedDepartement, communes) => {
        return communes && selectedDepartement && selectedDepartement.id
          ? communes.filter((commune) => {
              return (
                commune.departement &&
                commune.departement.id === selectedDepartement.id
              );
            })
          : [];
      }
    );
  };
}
