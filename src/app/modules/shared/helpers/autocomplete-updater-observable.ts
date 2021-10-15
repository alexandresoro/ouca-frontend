import { AbstractControl } from "@angular/forms";
import { merge, Observable, of } from "rxjs";
import { debounceTime, filter, map, switchMap } from "rxjs/operators";

export default <T extends { id: number }>(control: AbstractControl, queryResultsObservable: (value: string) => Observable<T[]>): Observable<T[]> => {
  return merge(
    control.valueChanges.pipe(
      filter((value: string | T) => typeof value === "string"),
      debounceTime(150),
      switchMap((value: string) => {
        if (value?.length === 0) { // If the requested value is an empty string, do not display any result
          return of([]);
        }
        return queryResultsObservable(value);
      })
    ),
    control.valueChanges.pipe(
      filter((value: string | T) => typeof value !== "string" && !!value?.id),
      map((value: T) => [value])
    )
  );

}

export const autocompleteWithParentHandler = <P, C extends { id: number }>(
  [parentValue, childValue]: [P | string, C | string],
  queryResultsObservable: (parentValue: P, childValue: string) => Observable<C[]>
): Observable<C[]> => {

  // 1. parent is a non empty string, no commune should match
  if (typeof parentValue === "string" && parentValue.length) {
    return of([] as C[]);
  }

  // 2. child is a valid child with id only return itself
  if (typeof childValue !== "string" && !!childValue?.id) {
    return of([childValue]);
  }

  // 3. Commune is empty
  if (!childValue) {
    return of([] as C[]);
  }

  // At this point classe can be
  // - A valid parent with id -> filter children accordingly
  // - null -> no filter
  // - empty string -> no filter
  return queryResultsObservable(parentValue as P, childValue as string);
}