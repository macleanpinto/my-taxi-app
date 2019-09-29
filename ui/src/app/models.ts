import { RideScheduleType, CarType } from './enums';

export interface Location {
    lat: string;
    long: string;
}
export interface Place {
    index: number;
    loc: google.maps.GeocoderResult | google.maps.places.PlaceResult;
}

export interface RideSearchRequest {
    pickupLocation: google.maps.GeocoderResult[] | google.maps.places.PlaceResult[];
    dropLocation: google.maps.GeocoderResult[] | google.maps.places.PlaceResult[];
    rideSchedule: RideScheduleType;
    rideDate: string;
    rideTime: string;
    carType: CarType;
    bid: number;
}
