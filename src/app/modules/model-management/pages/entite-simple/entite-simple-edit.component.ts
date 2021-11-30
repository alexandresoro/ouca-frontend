import { Location } from "@angular/common";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { combineLatest, Observable, ReplaySubject } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { EntiteSimple } from "./entite-simple.component";

export abstract class EntiteSimpleEditAbstractComponent<
  T extends EntiteSimple
  > {
  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected location: Location
  ) { }

  public abstract saveEntity(formValue: unknown): void;

  private form: FormGroup;

  private entityToDisplay$: ReplaySubject<{
    entity: T;
    isEditingMode: boolean;
  }> = new ReplaySubject(1);

  protected initialize(): void {
    combineLatest(this.route.paramMap, this.route.data)
      .pipe(
        switchMap(([params, data]) => {
          const isEditingMode: boolean = data.isEditingMode;
          const id = Number(params.get("id"));
          // TODO could we improve this by only fetching the correct id now via GQL ?
          return this.getEntities$().pipe(
            map((entities) => {
              const entityMatching = entities?.find((entity) => {
                return entity.id === id;
              });
              return {
                entity: entityMatching,
                isEditingMode
              };
            })
          );
        })
      )
      .subscribe((entityToDisplay) => {
        this.entityToDisplay$.next(entityToDisplay);
        this.entityToDisplay$.complete();
      });

    this.form = this.createForm();

    this.entityToDisplay$.subscribe((entityToDisplay) => {
      if (entityToDisplay?.entity) {
        this.form.reset(this.getFormValue(entityToDisplay.entity));
      } else if (!entityToDisplay.isEditingMode) {
        this.form.reset();
      } else {
        this.location.back();
      }
    });
  }

  public backToEntityPage = (): void => {
    this.router.navigate(["/" + this.getEntityName()]);
  };

  abstract getEntityName(): string;

  abstract getEntities$(): Observable<T[]>;

  protected getFormValue(entity: T): unknown {
    return entity;
  }

  public getEntityToDisplay$ = (): Observable<T> => {
    return this.entityToDisplay$.pipe(map((entity) => entity?.entity));
  };

  public getIsEditionMode$ = (): Observable<boolean> => {
    return this.entityToDisplay$.pipe(
      map((entity) => (entity?.isEditingMode ? true : false))
    );
  };

  abstract getFormType(): unknown;

  abstract createForm(): FormGroup;

  public getForm = (): FormGroup => {
    return this.form;
  };
}
