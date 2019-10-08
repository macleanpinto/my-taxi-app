import { CarType } from '../enums';

export interface CustomerState {
    pickupLocation: Map<number, google.maps.GeocoderResult | google.maps.places.PlaceResult>;
    dropLocation: Map<number, google.maps.GeocoderResult | google.maps.places.PlaceResult>;
    rideSchedule: string;
    rideDate: string;
    rideTime: string;
    carType: CarType;
    bid: number;
}


