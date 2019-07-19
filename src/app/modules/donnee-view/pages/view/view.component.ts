import { NestedTreeControl } from "@angular/cdk/tree";
import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { Age } from "basenaturaliste-model/age.object";
import { Classe } from "basenaturaliste-model/classe.object";
import { Commune } from "basenaturaliste-model/commune.object";
import { Departement } from "basenaturaliste-model/departement.object";
import { Espece } from "basenaturaliste-model/espece.object";
import { EstimationDistance } from "basenaturaliste-model/estimation-distance.object";
import { EstimationNombre } from "basenaturaliste-model/estimation-nombre.object";
import { Lieudit } from "basenaturaliste-model/lieudit.object";
import { Observateur } from "basenaturaliste-model/observateur.object";
import { Sexe } from "basenaturaliste-model/sexe.object";
import * as _ from "lodash";
import { combineLatest, Observable, Subject } from "rxjs";
import { PageStatusHelper } from "../../../shared/helpers/page-status.helper";
import { BackendApiService } from "../../../shared/services/backend-api.service";
import { SelectDialogData } from "../../components/select-dialog/select-dialog-data.object";
import { SelectDialogComponent } from "../../components/select-dialog/select-dialog.component";
import columnsData from "./columns.json";

interface TreeNode {
  key: string;
  children?: TreeNode[];
}

interface WhereRow {
  key: string;
  type: string;
  operatorKey: string;

  value: string;
}

const COLUMNS_TREE_DATA: TreeNode[] = [
  {
    key: "Fiche espèce",
    children: [
      {
        key: "Fiche inventaire",
        children: [
          {
            key: "Qui ?",
            children: [{ key: "observateur" }, { key: "associes" }]
          },
          {
            key: "Quand ?",
            children: [
              { key: "date" },
              { key: "annee" },
              { key: "mois" },
              { key: "heure" },
              { key: "duree" }
            ]
          },
          {
            key: "Où ?",
            children: [
              { key: "departement" },
              {
                key: "Commune",
                children: [{ key: "codeCommune" }, { key: "nomCommune" }]
              },
              {
                key: "Lieu-dit",
                children: [
                  { key: "lieudit" },
                  { key: "altitude" },
                  { key: "longitude" },
                  { key: "latitude" },
                  { key: "personalisedLieudit" }
                ]
              }
            ]
          },
          {
            key: "Météo",
            children: [{ key: "temperature" }, { key: "meteos" }]
          },
          { key: "inventaireCreationDate" }
        ]
      },
      {
        key: "Espèce",
        children: [
          { key: "classe" },
          { key: "codeEspece" },
          { key: "nomFrancaisEspece" },
          { key: "nomLatinEspece" }
        ]
      },
      {
        key: "Caractéristiques",
        children: [
          {
            key: "Nombre d'individus",
            children: [{ key: "estimationNombre" }, { key: "nombre" }]
          },
          { key: "sexe" },
          { key: "age" },
          {
            key: "Comportements",
            children: [
              { key: "codeComportement" },
              { key: "libelleComportement" }
            ]
          }
        ]
      },
      {
        key: "Situation",
        children: [
          {
            key: "Distance de vue",
            children: [{ key: "estimationDistance" }, { key: "distance" }]
          },
          {
            key: "Milieux",
            children: [{ key: "codeMilieu" }, { key: "libelleMilieu" }]
          }
        ]
      },
      { key: "regroupement" },
      { key: "commentaire" },
      { key: "donneeCreationDate" }
    ]
  }
];

@Component({
  templateUrl: "./view.tpl.html"
})
export class ViewComponent {
  public searchForm: FormGroup = new FormGroup({
    id: new FormControl(),
    observateur: new FormControl(),
    temperature: new FormControl(),
    especeGroup: new FormGroup({
      classe: new FormControl(),
      espece: new FormControl()
    }),
    lieuditGroup: new FormGroup({
      departement: new FormControl(),
      commune: new FormControl(),
      lieudit: new FormControl()
    }),
    nombreGroup: new FormGroup({
      nombre: new FormControl(""),
      estimationNombre: new FormControl("")
    }),
    sexe: new FormControl(""),
    age: new FormControl(""),
    distanceGroup: new FormGroup({
      distance: new FormControl(""),
      estimationDistance: new FormControl("")
    }),
    regroupement: new FormControl(""),
    fromDate: new FormControl(),
    toDate: new FormControl()
  });

  public observateurs: Observateur[];
  public departements$: Subject<Departement[]>;
  public communes$: Subject<Commune[]>;
  public lieuxdits$: Subject<Lieudit[]>;
  public classes$: Subject<Classe[]>;
  public especes$: Subject<Espece[]>;
  public estimationsNombre: EstimationNombre[];
  public estimationsDistance: EstimationDistance[];
  public sexes: Sexe[];
  public ages: Age[];

  treeControl = new NestedTreeControl<TreeNode>((node) => node.children);
  treeData = new MatTreeNestedDataSource<TreeNode>();

  treeSelection: string[];

  selectOptions: SelectRow[];

  whereOptions: WhereRow[];

  public selectTableDisplayedColumns: string[] = [
    "updown",
    "function",
    "column",
    "ordering",
    "groupby",
    "edit",
    "delete"
  ];

  public whereTableDisplayedColumns: string[] = [
    "updown",
    "column",
    "edit",
    "delete"
  ];

  public selectTableDataSource: MatTableDataSource<SelectRow>;
  public whereTableDataSource: MatTableDataSource<WhereRow>;

  public columns: any;

  public displayWaitPanel: boolean = false;

  public donneesToDisplay: any[] = [];

  constructor(
    private backendApiService: BackendApiService,
    public dialog: MatDialog
  ) {
    this.treeData.data = COLUMNS_TREE_DATA;
    this.treeSelection = [];
    this.selectOptions = [];
    this.whereOptions = [];
  }

  hasChild = (n: number, node: TreeNode) =>
    !!node.children && node.children.length > 0

  public ngOnInit(): void {
    this.classes$ = new Subject();
    this.especes$ = new Subject();
    this.departements$ = new Subject();
    this.communes$ = new Subject();
    this.lieuxdits$ = new Subject();
    // TODO
    this.columns = columnsData;

    combineLatest(
      this.backendApiService.getAllEntities("classe") as Observable<Classe[]>,
      this.backendApiService.getAllEntities("espece") as Observable<Espece[]>,
      this.backendApiService.getAllEntities("departement") as Observable<
        Departement[]
      >,
      this.backendApiService.getAllEntities("commune") as Observable<Commune[]>,
      this.backendApiService.getAllEntities("lieudit") as Observable<Lieudit[]>,
      this.backendApiService.getAllEntities("observateur") as Observable<
        Observateur[]
      >,
      this.backendApiService.getAllEntities("sexe") as Observable<Sexe[]>,
      this.backendApiService.getAllEntities("age") as Observable<Age[]>,
      this.backendApiService.getAllEntities("estimation-nombre") as Observable<
        EstimationNombre[]
      >,
      this.backendApiService.getAllEntities(
        "estimation-distance"
      ) as Observable<EstimationDistance[]>
    ).subscribe(
      (
        result: [
          Classe[],
          Espece[],
          Departement[],
          Commune[],
          Lieudit[],
          Observateur[],
          Sexe[],
          Age[],
          EstimationNombre[],
          EstimationDistance[]
        ]
      ) => {
        this.classes$.next(!!result[0] ? result[0] : []);
        this.especes$.next(!!result[1] ? result[1] : []);
        this.departements$.next(!!result[2] ? result[2] : []);
        this.communes$.next(!!result[3] ? result[3] : []);
        this.lieuxdits$.next(!!result[4] ? result[4] : []);
        this.observateurs = !!result[5] ? result[5] : [];
        this.sexes = !!result[6] ? result[6] : [];
        this.ages = !!result[7] ? result[7] : [];
        this.estimationsNombre = !!result[8] ? result[8] : [];
        this.estimationsDistance = !!result[9] ? result[9] : [];
      },
      (error: HttpErrorResponse) => {
        console.error(
          "Impossible de trouver les classes ou les espèces (" + error + ")"
        );
      }
    );
  }

  public onSearchButtonClicked(): void {
    this.displayWaitPanel = true;
    console.log(this.searchForm);

    this.backendApiService
      .getDonneesByCustomizedFilters(this.searchForm.value)
      .subscribe(
        (results: any) => {
          this.displayWaitPanel = false;
          this.donneesToDisplay = results;
        },
        (error: any) => {
          PageStatusHelper.setErrorStatus(
            "Impossible de récupérer les fiches espèces.",
            error
          );
          this.displayWaitPanel = false;
        }
      );
  }

  public onSearchAllDonneesButtonClicked(): void {
    this.displayWaitPanel = true;
    console.log("SELECT", this.selectOptions);
    console.log("WHERE", this.whereOptions);

    this.backendApiService.getAllDonnees().subscribe(
      (results: any) => {
        this.displayWaitPanel = false;
        this.donneesToDisplay = results;
      },
      (error: any) => {
        PageStatusHelper.setErrorStatus(
          "Impossible de récupérer les fiches espèces.",
          error
        );
        this.displayWaitPanel = false;
      }
    );
  }

  public onTreeCheckboxClicked(isSelected: boolean, key: string): void {
    if (!!isSelected) {
      this.treeSelection.push(key);
    } else {
      _.remove(this.treeSelection, (value: string) => {
        return value === key;
      });
    }
  }

  public isTreeCheckboxSelected(key: string) {
    return this.treeSelection.indexOf(key) >= 0;
  }

  public onAddSelectButtonClicked(): void {
    for (const column of this.treeSelection) {
      const row: SelectRow = {
        key: column,
        ordering: "",
        groupBy: false
      };
      this.selectOptions.push(row);
    }
    this.selectTableDataSource = new MatTableDataSource(this.selectOptions);
    this.treeSelection = [];
  }

  public onAddWhereButtonClicked(): void {
    for (const column of this.treeSelection) {
      const row: WhereRow = {
        key: column,
        type: "column",
        operatorKey: "",
        value: ""
      };
      this.whereOptions.push(row);
    }
    this.whereTableDataSource = new MatTableDataSource(this.whereOptions);
    this.treeSelection = [];
  }

  public onDeleteSelectRowButtonClicked(row: SelectRow): void {
    _.remove(this.selectOptions, (option: SelectRow) => {
      return option === row;
    });
    this.selectTableDataSource = new MatTableDataSource(this.selectOptions);
  }

  public onEditSelectRowButtonClicked(row: SelectRow): void {
    this.displaySelectDialog(row);
  }
  private displaySelectDialog(row: SelectRow): void {
    const updateRowSelectData = new SelectDialogData(row);
    const dialogRef = this.dialog.open(SelectDialogComponent, {
      width: "700px",
      data: updateRowSelectData
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!!result) {
        // We just update the inventaire
        // this.updateInventaireAndDonnee(false);
        alert("todo");
      } else {
        // We create a new inventaire for this donnee
        // this.updateInventaireAndDonnee(true);
        alert("todo");
      }
    });
  }
  public onUpSelectRowButtonClicked(row: SelectRow): void {
    this.moveSelectRow(row, true);
  }

  public onDownSelectRowButtonClicked(row: SelectRow): void {
    this.moveSelectRow(row, false);
  }

  private moveSelectRow(row: SelectRow, upDirection: boolean = false): void {
    const rowIndex: number = this.selectOptions.indexOf(row);
    const rowToMove: SelectRow = this.selectOptions[rowIndex];

    let newIndex = rowIndex + 1;
    if (!!upDirection) {
      newIndex = rowIndex - 1;
    }

    if (
      (!!upDirection && newIndex >= 0) ||
      (!upDirection && newIndex < this.selectOptions.length)
    ) {
      this.selectOptions[rowIndex] = this.selectOptions[newIndex];
      this.selectOptions[newIndex] = rowToMove;
      this.selectTableDataSource = new MatTableDataSource(this.selectOptions);
    }
  }

  public onRemoveWhereRowButtonClicked(row: WhereRow): void {
    _.remove(this.whereOptions, (option: WhereRow) => {
      return option === row;
    });
    this.whereTableDataSource = new MatTableDataSource(this.whereOptions);
  }

  public onEditWhereRowButtonClicked(): void {
    alert("En cours de développement");
  }

  public onUpWhereRowButtonClicked(row: WhereRow): void {
    this.moveWhereRow(row, true);
  }

  public onDownWhereRowButtonClicked(row: WhereRow): void {
    this.moveWhereRow(row, false);
  }

  private moveWhereRow(row: WhereRow, upDirection: boolean = false): void {
    const rowIndex: number = this.whereOptions.indexOf(row);
    const rowToMove: WhereRow = this.whereOptions[rowIndex];

    let newIndex = rowIndex + 1;
    if (!!upDirection) {
      newIndex = rowIndex - 1;
    }

    if (
      (!!upDirection && newIndex >= 0) ||
      (!upDirection && newIndex < this.whereOptions.length)
    ) {
      this.whereOptions[rowIndex] = this.whereOptions[newIndex];
      this.whereOptions[newIndex] = rowToMove;
      this.whereTableDataSource = new MatTableDataSource(this.whereOptions);
    }
  }

  public onAddLogicalOperatorButtonClicked(operator: string): void {
    const row: WhereRow = {
      key: operator,
      type: "logicalOperator",
      operatorKey: null,
      value: null
    };
    this.whereOptions.push(row);
    this.whereTableDataSource = new MatTableDataSource(this.whereOptions);
  }
}
