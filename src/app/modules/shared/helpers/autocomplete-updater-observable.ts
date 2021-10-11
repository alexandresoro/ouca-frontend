import { AbstractControl } from "@angular/forms";
import { merge, Observable } from "rxjs";
import { debounceTime, filter, map, switchMap } from "rxjs/operators";

export default <T extends { id: number }>(control: AbstractControl, queryResultsObservable: (value: string) => Observable<T[]>): Observable<T[]> => {
  return merge(
    control.valueChanges.pipe(
      filter((value: string | T) => typeof value === "string"),
      debounceTime(150),
      switchMap((value: string) => {
        return queryResultsObservable(value);
      })
    ),
    control.valueChanges.pipe(
      filter((value: string | T) => typeof value !== "string" && !!value?.id),
      map((value: T) => [value])
    )
  );

}