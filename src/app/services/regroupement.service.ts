import { Injectable } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

type RegroupementQueryResult = {
  nextRegroupement: number
}

const REGROUPEMENT_QUERY = gql`
  query RegroupementQuery {
    nextRegroupement
  }
`;

@Injectable({
  providedIn: "root"
})
export class RegroupementService {
  constructor(private apollo: Apollo) { }

  public updateNextRegroupement(): Observable<number> {
    return this.apollo.query<RegroupementQueryResult>({
      query: REGROUPEMENT_QUERY,
      fetchPolicy: 'network-only'
    }).pipe(
      map(({ data }) => data?.nextRegroupement)
    );
  }
}
