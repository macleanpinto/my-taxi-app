import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Subscription, Subject } from 'rxjs';
import * as moment from 'moment'
import { CarType, RideScheduleType } from '../../enums';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    sourcePlace: google.maps.GeocoderResult;
    destinationPlace: google.maps.GeocoderResult;
    CarType = CarType;
    carTypeList: CarType[] = [CarType.hatchback, CarType.sedan, CarType.suv, CarType.luxury];
    subscription: Subscription = new Subscription();
    rideSearchForm: FormGroup;
    enableRideTime = false;
    minDate = moment().format('YYYY-MM-DD');
    maxDate = moment().add(3, 'days').format('YYYY-MM-DD');
    minTime = moment().add(1, 'hours').format('YYYY-MM-DDTHH:mm');
    constructor(private router: Router, private storage: Storage, private fb: FormBuilder) { }

    ngOnInit(): void {

        this.rideSearchForm = this.fb.group({
            pickupLocation: ['Pickup From?', [Validators.required]],
            dropLocation: ['Where To?', [Validators.required]],
            rideSchedule: ['0', [Validators.required]],
            rideDate: [this.minDate],
            rideTime: [this.minTime],
            carType: ['', [Validators.required]],
            bid: ['', [Validators.required]]
        });

        this.rideSearchForm.get('rideSchedule').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((value: number) => {
                if (RideScheduleType.later === +value) {
                    this.enableRideTime = true;
                } else {
                    this.enableRideTime = false;
                }
            });

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

        this.router.events
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((event) => {
                if (event instanceof NavigationEnd) {
                    this.storage.keys().then((res: string[]) => {
                        res.forEach(key => {
                            this.storage.get(key).then((val: google.maps.GeocoderResult) => {
                                if (val) {
                                    if (key === 'from') {
                                        this.sourcePlace = val;
                                        this.rideSearchForm.get('pickupLocation').setValue(val.formatted_address);
                                    } else if (key === 'to') {
                                        this.destinationPlace = val;
                                        this.rideSearchForm.get('dropLocation').setValue(val.formatted_address);
                                    }

                                }
                            });
                        });

                    });
                }
            });

    }


    pickLocation(direction: string) {
        this.router.navigate(['/search'], { state: { data: { field: direction } }, skipLocationChange: true });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
