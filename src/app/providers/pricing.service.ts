import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Location, RideEstimate } from '../models';
import { RIDEESTIMATE } from '../mock_data/ride_estimate';

@Injectable()
export class PricingService {

  private fetchRideEstimateServiceUrl: string = environment.fetchRideEstimateService;
  constructor(private httpClient: HttpClient) { }

  public fetchRideEstimate(startLocation: Location, destination: Location): Observable<RideEstimate[]> {
    if (environment.production) {
      let params: HttpParams = new HttpParams();
      params.set('startLocation', JSON.stringify(startLocation));
      params.set('destination', JSON.stringify(destination));
      return this.httpClient.get(this.fetchRideEstimateServiceUrl, { params }).
        pipe(map((res: RideEstimate[]) => { return res }),
          catchError((err: HttpErrorResponse) => this.handleError));
    } else {
      return of(RIDEESTIMATE);
    }
  }

  public handleError(error: any) {
    console.log(error);
  }
}