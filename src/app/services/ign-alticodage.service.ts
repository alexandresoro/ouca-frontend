import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: "root"
})
export class IgnAlticodageService {

  private readonly alticodageUrl = "https://wxs.ign.fr/choisirgeoportail/alti/rest/elevation.json";

  constructor(private http: HttpClient) { }

  public getAltitudeForCoordinates = ([latitude, longitude]: [number, number]): Observable<number> => {
    const queryParams = new HttpParams()
      .set("lon", longitude.toString())
      .set("lat", latitude.toString())
      .set("zonly", "true");

    return this.http.get<{ elevations: number[] }>(this.alticodageUrl, { params: queryParams }).pipe(
      map(result => result?.elevations[0])
    );
  }
}
