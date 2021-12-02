import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Apollo, gql } from 'apollo-angular';
import { of, race, timer } from 'rxjs';
import { delay, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { NetworkUnavailableDialogComponent } from '../modules/shared/components/network-unavailable-dialog/network-unavailable-dialog.component';

const HEALTH_CHECK_QUERY = gql`
  query HealthCheck {
    __typename
  }
`;

@Injectable({
  providedIn: 'root',
})
export class ServerHealthCheckService {

  private matDialogRef: MatDialogRef<unknown>;

  constructor(
    private apollo: Apollo,
    private dialog: MatDialog
  ) {
  }

  public startHealthMonitoring = (): void => {

    timer(2000, 10000).pipe(
      switchMap(() => {
        return race(
          of(false).pipe(delay(1000)),
          this.apollo.query({
            query: HEALTH_CHECK_QUERY,
            fetchPolicy: 'no-cache'
          }).pipe(
            map((response) => !!response?.data),
          )
        )
      }),
      distinctUntilChanged()
    ).subscribe((isServerAlive) => {
      if (isServerAlive) {
        this.matDialogRef?.close();
      } else {
        this.openNetworkUnavailableDialog();
      }
    })

  }

  private openNetworkUnavailableDialog = (): void => {
    this.matDialogRef = this.dialog.open(NetworkUnavailableDialogComponent, {
      width: "800px",
      hasBackdrop: true,
      disableClose: true
    });
  };

}