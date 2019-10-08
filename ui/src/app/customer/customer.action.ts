import { Action } from 'redux';
import { RideSearchRequest } from '../models';

export class CreateAction implements Action {
    readonly type = 'CREATE';

    constructor(public payload: RideSearchRequest) { }
}
