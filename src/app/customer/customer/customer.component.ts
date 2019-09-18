import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { PricingService } from 'src/app/providers/pricing.service';
import { CarType, RideScheduleType } from '../../enums';

@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

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
            date: [''],
            time: [''],
            carType: ['', [Validators.required]],
            bid: ['', [Validators.required]]
        });

        this.subscription.add(this.rideSearchForm.get('rideSchedule').valueChanges.subscribe((value: number) => {
            if (RideScheduleType.later === value) {
                this.enableRideTime = true;
            } else {
                this.enableRideTime = false;
            }
        }));

        this.updatePickupAndDropLocation();
    }


    private updatePickupAndDropLocation() {
        this.storage.get('source').then(val => {
            if (val) {
                this.sourcePlace = val;
                console.log(val);
                this.rideSearchForm.get('pickupLocation').setValue(this.sourcePlace.name);
            }
        });
        this.storage.get('destination').then(val => {
            if (val) {
                this.destinationPlace = val;
                this.rideSearchForm.get('dropLocation').setValue(this.destinationPlace.name);
            }
        });
    }

    pickLocation(direction: string) {
        this.router.navigate(['/search'], { state: { data: { field: direction } }, skipLocationChange: true });
    }
    ionViewDidLeave() {
        this.subscription.unsubscribe();
    }
}
