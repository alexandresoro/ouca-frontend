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