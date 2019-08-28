import { CarType } from './enums';

export interface Location {
    lat: string;
    long: string;
}

export interface RideEstimate {
    carType: CarType;
    fare: number;
}