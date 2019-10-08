/**
 * Counter Reducer
 */
import { Action, Reducer } from 'redux';
import { CarType } from '../enums';
import { CreateAction } from './customer.action';
import { CustomerState } from './customer.state';

const initialState: CustomerState = {
    pickupLocation: new Map(),
    dropLocation: new Map(),
    rideSchedule: '',
    rideDate: '',
    rideTime: '',
    carType: CarType.hatchback,
    bid: 100
};

// Create our reducer that will handle changes to the state
export const counterReducer: Reducer<CustomerState> =
    (state: CustomerState = initialState, action: CreateAction): CustomerState => {
        switch (action.type) {
            case 'CREATE':
                return Object.assign({}, state, action.payload);
            default:
                return state;
        }
    };