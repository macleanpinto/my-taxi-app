import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { PricingService } from 'src/app/providers/pricing.service';
import { CarType, RideScheduleType } from '../../enums';

@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit, OnDestroy {

    sourcePlace: google.maps.places.PlaceResult;
    destinationPlace: google.maps.places.PlaceResult;
    CarType = CarType;
    carTypeList: CarType[] = [CarType.hatchback, CarType.sedan, CarType.suv, CarType.luxury];
    subscription: Subscription = new Subscription();
    rideSearchForm: FormGroup;
    enableRideTime = false;
    constructor(private router: Router, private pricingService: PricingService, private storage: Storage, private fb: FormBuilder) { }

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

        this.subscription.add(this.rideSearchForm.get('rideSchedule').valueChanges.subscribe((value: number) => {
            if (RideScheduleType.later === +value) {
                this.enableRideTime = true;
            } else {
                this.enableRideTime = false;
            }
        }));

        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.storage.keys().then((res: string[]) => {
                    res.forEach(key => {
                        this.storage.get(key).then((val: google.maps.GeocoderResult) => {
                            if (val) {
                                if (key === 'from') {
                                    this.rideSearchForm.get('pickupLocation').setValue(val.formatted_address);
                                } else if (key === 'to') {
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
    ionViewDidLeave() {
        this.subscription.unsubscribe();
    }
    ngOnDestroy() {
        console.log('fsdfsdfdsffdsf');
    }
}
