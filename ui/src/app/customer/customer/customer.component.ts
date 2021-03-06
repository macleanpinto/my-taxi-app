import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Store } from 'redux';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RideSearchRequest } from 'src/app/models';
import { CarType, RideScheduleType, VehicleType } from '../../enums';
import * as customerActions from '../customer.actions';
import { CustomerState } from '../customer.state';
import { CustStore } from '../customer.store';
import { CreateAction } from '../customer.action';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    CarType = CarType;
    carTypeList: CarType[] = [CarType.hatchback, CarType.sedan, CarType.suv, CarType.luxury];
    subscription: Subscription = new Subscription();
    rideSearchForm: FormGroup;
    enableRideTime = true;
    minDate = moment().format('YYYY-MM-DD');
    maxDate = moment().add(3, 'days').format('YYYY-MM-DD');
    minTime = moment().add(1, 'hours').format('YYYY-MM-DDTHH:mm');
    private rideSearchRequest: RideSearchRequest;

    constructor(
        private router: Router, private fb: FormBuilder,
        @Inject(CustStore) private store: Store<CustomerState>,
        private firestore: AngularFirestore) {
        store.subscribe(() => this.readState());
        this.readState();
    }

    ngOnInit(): void {
        this.InitializeForm();
        this.toggleRideSchedule();
        this.setPickupTimeRanges();
    }
    readState() {
        const state: CustomerState = this.store.getState();
        this.rideSearchRequest = Object.assign({}, state.rideSearchRequest);
        this.rideSearchRequest.pickupLocation.forEach(
            (place: google.maps.GeocoderResult | google.maps.places.PlaceResult, index: number) => {
                const formArray: any = this.rideSearchForm.get('pickupLocation');
                formArray.controls[index].setValue(place.formatted_address);
            });
        this.rideSearchRequest.dropLocation.forEach(
            (place: google.maps.GeocoderResult | google.maps.places.PlaceResult, index: number) => {
                const formArray: any = this.rideSearchForm.get('dropLocation');
                formArray.controls[index].setValue(place.formatted_address);
            });
    }
    get dropLocation() {
        const formArray: any = this.rideSearchForm.get('dropLocation');
        return formArray.controls;

    }
    get pickupLocation() {
        const formArray: any = this.rideSearchForm.get('pickupLocation');
        return formArray.controls;
    }
    searchLocation(direction: string, i: number) {
        this.router.navigate(['/search'], { state: { data: { field: direction, index: i } }, skipLocationChange: true });
    }

    addControl(formControlName: string, value: string) {
        const formArray: any = this.rideSearchForm.get(formControlName);
        if (formArray.length < 4) {
            formArray.push(new FormControl(value, [this.validateLocation, Validators.required]));
        }
    }

    private updateReduxStore() {
        this.store.dispatch(customerActions.create(this.rideSearchForm));
    }

    removeControl(formControlName: string, index: number) {
        const formArray: any = this.rideSearchForm.get(formControlName);
        if (formArray.length > 1) {
            formArray.removeAt(index);
        }
        this.rideSearchRequest[formControlName].pop();
        this.updateReduxStore();
    }
    cancel() {
        this.store.dispatch(customerActions.clear());
        this.rideSearchForm.reset();
    }
    requestForCab() {
        const pickupLocation = [];
        console.log(this.rideSearchRequest.pickupLocation);
        this.rideSearchRequest.pickupLocation.forEach(
            (place: google.maps.GeocoderResult | google.maps.places.PlaceResult, index: number) => {
                pickupLocation.push({ place_id: place.place_id, lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), formatted_address: place.formatted_address });
            });
        const dropLocation = [];
        this.rideSearchRequest.pickupLocation.forEach(
            (place: google.maps.GeocoderResult | google.maps.places.PlaceResult, index: number) => {
                dropLocation.push({ place_id: place.place_id, lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), formatted_address: place.formatted_address });
            });
        const rideSearchRequest: RideSearchRequest = {
            rideScheduleType: this.rideSearchForm.get('rideScheduleType').value,
            rideDate: this.rideSearchForm.get('rideDate').value,
            rideTime: this.rideSearchForm.get('rideTime').value,
            carType: this.rideSearchForm.get('carType').value,
            bid: this.rideSearchForm.get('bid').value,
            pickupLocation,
            dropLocation,
        };
        console.log(rideSearchRequest);
        this.store.dispatch(customerActions.create(rideSearchRequest));
        const collection = this.firestore.collection('cabSearchRequests');
        return collection.add(rideSearchRequest);
    }

    onScroll($event) {
        console.log($event);
    }


    private setPickupTimeRanges() {
        this.rideSearchForm.get('rideDate').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((date => {
                if (moment(date).isAfter(moment(this.minDate))) {
                    this.minTime = this.minDate;
                } else {
                    this.minTime = moment().add(1, 'hours').format('YYYY-MM-DDTHH:mm');
                    this.rideSearchForm.get('rideTime').setValue(this.minTime);
                }
            }));
    }

    private toggleRideSchedule() {
        this.rideSearchForm.get('rideScheduleType').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((value: number) => {
                if (RideScheduleType.later === +value) {
                    this.enableRideTime = true;
                } else {
                    this.enableRideTime = false;
                }
            });
    }

    private InitializeForm() {
        this.rideSearchForm = this.fb.group({
            pickupLocation: this.fb.array([new FormControl('Pickup From?', [this.validateLocation, Validators.required])]),
            dropLocation: this.fb.array([new FormControl('Where To?', [this.validateLocation, Validators.required])]),
            rideScheduleType: [RideScheduleType.later + '', [Validators.required]],
            rideDate: [this.minDate],
            rideTime: [this.minTime],
            vehicleType: [VehicleType.car + '', [Validators.required]],
            carType: [CarType.sedan, [Validators.required]],
            bid: ['', [Validators.required, Validators.min(50), Validators.pattern('\\d+')]],
            updateOn: 'blur'
        });
    }

    private validateLocation(c: FormControl) {
        return c.value.match(/Pickup|Where/g) ? {
            required: {
                valid: false
            }
        } : null;
    }


    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
