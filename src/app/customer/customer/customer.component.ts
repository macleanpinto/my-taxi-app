import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Subscription, Subject } from 'rxjs';
import { PricingService } from 'src/app/providers/pricing.service';
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
    constructor(private router: Router, private storage: Storage, private fb: FormBuilder) { }

    ngOnInit(): void {

        this.rideSearchForm = this.fb.group({
            pickupLocation: ['Pickup From?', [Validators.required]],
            dropLocation: ['Where To?', [Validators.required]],
            rideSchedule: ['0', [Validators.required]],
            rideDate: [''],
            rideTime: [''],
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
