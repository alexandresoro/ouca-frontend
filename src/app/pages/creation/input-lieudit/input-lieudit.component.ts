import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Commune } from "../../../model/commune.object";
import { Departement } from "../../../model/departement.object";
import { Lieudit } from "../../../model/lieudit.object";

@Component({
  selector: "input-lieudit",
  templateUrl: "./input-lieudit.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputLieuditComponent implements OnInit {
  @Input() public departements: Departement[];

  @Input() public communes: Commune[];

  @Input() public lieuxdits: Lieudit[];

  @Input() public controlGroup: FormGroup;

  public filteredCommunes: Commune[];

  public filteredLieuxdits: Lieudit[];

  public ngOnInit(): void {
    this.filteredCommunes = [];
    this.filteredLieuxdits = [];
  }

  /**
   * When selecting a departement, filter the list of communes and reset the list of lieux-dits
   * and reset coordinates
   */
  public updateCommunes(selectedDepartement: Departement): void {
    if (!!selectedDepartement && !!selectedDepartement.id) {
      this.controlGroup.controls.commune.setValue(null);
      this.controlGroup.controls.lieudit.setValue(null);
      this.filteredCommunes = this.communes.filter(
        (commune) => commune.departementId === selectedDepartement.id
      );

      this.filteredLieuxdits = [];
      this.resetSelectedCoordinates();
    }
  }

  /**
   * When selecting a commune, filter the list of lieux-dits and reset coordinates
   */
  public updateLieuxDits(selectedCommune: Commune): void {
    if (!!selectedCommune && !!selectedCommune.id) {
      this.controlGroup.controls.lieudit.setValue(null);
      this.filteredLieuxdits = this.lieuxdits.filter(
        (lieudit) => lieudit.communeId === selectedCommune.id
      );

      this.resetSelectedCoordinates();
    }
  }

  /**
   * When selecting a lieu-dit, update coordinates
   */
  public updateCoordinates(lieuDit: Lieudit): void {
    if (
      !!lieuDit &&
      !!lieuDit.altitude &&
      !!lieuDit.longitude &&
      !!lieuDit.latitude
    ) {
      this.setSelectedCoordinates(
        lieuDit.altitude,
        lieuDit.longitude,
        lieuDit.latitude
      );
    } else {
      this.resetSelectedCoordinates();
    }
  }

  private resetSelectedCoordinates(): void {
    this.setSelectedCoordinates(null, null, null);
  }

  private setSelectedCoordinates(
    altitude: number,
    longitude: number,
    latitude: number
  ): void {
    this.controlGroup.controls.altitude.setValue(altitude);
    this.controlGroup.controls.longitude.setValue(longitude);
    this.controlGroup.controls.latitude.setValue(latitude);
  }

  private displayCommuneFormat = (commune: Commune): string => {
    return !!commune ? commune.code + " - " + commune.nom : "";
  }

  private displayDepartementFormat = (departement: Departement): string => {
    return departement.code;
  }

  private displayLieuDitFormat = (lieuDit: Lieudit): string => {
    return !!lieuDit ? lieuDit.nom : null;
  }
}
