import { InjectionToken } from '@angular/core';
import { compose, createStore, Store, StoreEnhancer } from 'redux';
import { customerReducer as reducer } from './customer.reducer';
import { CustomerState } from './customer.state';

export const CustStore = new InjectionToken('cust.store');

const devtools: StoreEnhancer<CustomerState> =
    // tslint:disable-next-line: no-string-literal
    window['devToolsExtension'] ?
        // tslint:disable-next-line: no-string-literal
        window['devToolsExtension']() : f => f;

export function createAppStore(): Store<CustomerState> {
    return createStore(
        reducer,
        compose(devtools)
    );
}

export const custStoreProviders = [
    { provide: CustStore, useFactory: createAppStore }
];
