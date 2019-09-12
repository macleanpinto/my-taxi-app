import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Location } from '../models';

@Injectable()
export class PricingService {

  constructor(private httpClient: HttpClient) { }

  public handleError(error: any) {
    console.log(error);
  }
}
