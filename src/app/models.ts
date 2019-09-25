import { CarType } from './enums';

export interface Location {
    lat: string;
    long: string;
}
export interface Place {
    index: number;
    loc: google.maps.GeocoderResult | google.maps.places.PlaceResult;
}
