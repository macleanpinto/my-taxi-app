import { Injectable } from '@angular/core';
import { Place } from './models';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // tslint:disable-next-line: variable-name
  private _source: Place[] = [];
  // tslint:disable-next-line: variable-name
  private _destination: Place[] = [];
  private _notify: Subject<boolean> = new Subject();

  constructor() { }

  public get source(): Place[] {
    return this._source;
  }
  public set source(value: Place[]) {
    this._source = value;
  }
  public get destination(): Place[] {
    return this._destination;
  }
  public set destination(value: Place[]) {
    this._destination = value;
  }

  public get notify(): Subject<boolean> {
    return this._notify;
  }
  public set notify(value: Subject<boolean>) {
    this._notify = value;
  }


}
