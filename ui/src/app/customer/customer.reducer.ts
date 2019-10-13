import { Action, Reducer } from 'redux';
import { CarType, RideScheduleType } from '../enums';
import { CustomerState } from './customer.state';
import { CreateAction } from './customer.action';

const initialState: CustomerState = {
    rideSearchRequest: {
        pickupLocation: new Array(4),
        dropLocation: new Array(4),
        rideScheduleType: RideScheduleType.later,
        rideDate: '',
        rideTime: '',
        carType: CarType.hatchback,
        bid: 100
    }
};

// Create our reducer that will handle changes to the state
export const customerReducer: Reducer<CustomerState> =
    (state: CustomerState = initialState, action: Action): CustomerState => {
        switch (action.type) {
            case 'CREATE':
                return Object.assign({}, state, (action as CreateAction).payload);
                break;
            case 'CLEAR':
                return Object.assign({}, initialState);
                break;
            default:
                return state;
                break;
        }
    };
