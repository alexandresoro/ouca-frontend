import { Observable, pipe, UnaryFunction } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

// Like distinctUntilKeyChanged, except it will consider null and undefined are similar between themselves and different to anything non null/undefied
export const distinctUntilKeyChangedLoose = <T extends { [key: string]: unknown }>(key: string | number): UnaryFunction<Observable<T>, Observable<T>> => {
  return pipe(
    distinctUntilChanged<T>((first, second) => { // Do not emit anything if this is exactly the same lieu dit
      if (first === second) return true;
      if (first && second && first[key] === second[key]) return true;
      return false;
    })
  );
}