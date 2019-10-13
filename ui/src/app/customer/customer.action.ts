import { Action } from 'redux';
import { RideSearchRequest } from '../models';

export class CreateAction implements Action {
    readonly type = 'CREATE';

    constructor(public payload: RideSearchRequest) { }
}


export class ClearAction implements Action {
    readonly type = 'CLEAR';

    constructor() { }
}

