import { Injectable } from '@angular/core';
import { Place } from './models';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // tslint:disable-next-line: variable-name
  private _pickupLocation: Map<number, google.maps.GeocoderResult | google.maps.places.PlaceResult> = new Map();

  // tslint:disable-next-line: variable-name
  private _dropLocation: Map<number, google.maps.GeocoderResult | google.maps.places.PlaceResult> = new Map();

  // tslint:disable-next-line: variable-name
  private _notify: Subject<boolean> = new Subject();

  constructor() { }
  public get pickupLocation(): Map<number, google.maps.GeocoderResult | google.maps.places.PlaceResult> {
    return this._pickupLocation;
  }
  public set pickupLocation(value: Map<number, google.maps.GeocoderResult | google.maps.places.PlaceResult>) {
    this._pickupLocation = value;
  }
  public get dropLocation(): Map<number, google.maps.GeocoderResult | google.maps.places.PlaceResult> {
    return this._dropLocation;
  }
  public set dropLocation(value: Map<number, google.maps.GeocoderResult | google.maps.places.PlaceResult>) {
    this._dropLocation = value;
  }
  public get notify(): Subject<boolean> {
    return this._notify;
  }
  public set notify(value: Subject<boolean>) {
    this._notify = value;
  }

}
