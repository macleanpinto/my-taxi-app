import { ActionCreator } from 'redux';
import { CreateAction, ClearAction } from './customer.action';
import { RideSearchRequest } from '../models';

export const create: ActionCreator<CreateAction> = (payload: RideSearchRequest) => ({
    type: 'CREATE',
    payload
});

export const clear: ActionCreator<ClearAction> = () => ({
    type: 'CLEAR'
});


