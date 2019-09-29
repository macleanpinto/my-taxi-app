import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from 'src/app/data.service';
import { Place, RideSearchRequest } from 'src/app/models';
import { CarType, RideScheduleType } from '../../enums';

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
    enableRideTime = false;
    minDate = moment().format('YYYY-MM-DD');
    maxDate = moment().add(3, 'days').format('YYYY-MM-DD');
    minTime = moment().add(1, 'hours').format('YYYY-MM-DDTHH:mm');
    constructor(private router: Router, private fb: FormBuilder, private dataService: DataService) { }

    ngOnInit(): void {
        this.InitializeForm();
        this.toggleRideSchedule();
        this.setPickupTimeRanges();
        this.setPickupAndDropLocation();
    }
    get dropLocation() {
        const formArray: any = this.rideSearchForm.get('dropLocation');
        return formArray.controls;

    }
    get pickupLocation() {
        const formArray: any = this.rideSearchForm.get('pickupLocation');
        return formArray.controls;
    }
    pickLocation(direction: string, i: number) {
        this.router.navigate(['/search'], { state: { data: { field: direction, index: i } }, skipLocationChange: true });
    }

    addControl(formControlName: string, value: string) {
        const formArray: any = this.rideSearchForm.get(formControlName);
        if (formArray.length < 4) {
            formArray.push(new FormControl(value, [Validators.required]));
        }
    }

    removeControl(formControlName: string, index: number) {
        const formArray: any = this.rideSearchForm.get(formControlName);
        if (formArray.length > 1) {
            formArray.removeAt(index);
        }
        this.dataService[formControlName].pop();
    }
    cancel() {
        this.rideSearchForm.reset();
    }
    requestForCab() {
        console.log(this.rideSearchForm.errors);
        const pickupLocation = [];
        this.dataService.pickupLocation.forEach(
            (place: google.maps.GeocoderResult | google.maps.places.PlaceResult, index: number) => {
                pickupLocation.push(place);
            });
        const dropLocation = [];
        this.dataService.pickupLocation.forEach(
            (place: google.maps.GeocoderResult | google.maps.places.PlaceResult, index: number) => {
                dropLocation.push(place);
            });
        const rideSearchRequest: RideSearchRequest = {
            pickupLocation,
            dropLocation,
            rideSchedule: this.rideSearchForm.get('rideSchedule').value,
            rideDate: this.rideSearchForm.get('rideDate').value,
            rideTime: this.rideSearchForm.get('rideTime').value,
            carType: this.rideSearchForm.get('carType').value,
            bid: this.rideSearchForm.get('bid').value
        };
    }

    onScroll($event) {
        console.log($event);
    }

    private setPickupAndDropLocation() {
        this.dataService.notify.pipe(takeUntil(this.unsubscribe))
            .subscribe(() => {
                this.dataService.pickupLocation.forEach(
                    (place: google.maps.GeocoderResult | google.maps.places.PlaceResult, index: number) => {
                        const formArray: any = this.rideSearchForm.get('pickupLocation');
                        formArray.controls[index].setValue(place.formatted_address);
                    });
                this.dataService.dropLocation.forEach(
                    (place: google.maps.GeocoderResult | google.maps.places.PlaceResult, index: number) => {
                        const formArray: any = this.rideSearchForm.get('dropLocation');
                        formArray.controls[index].setValue(place.formatted_address);
                    });
            });
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
        this.rideSearchForm.get('rideSchedule').valueChanges
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
            pickupLocation: this.fb.array([new FormControl('Pickup From?', [Validators.required])]),
            dropLocation: this.fb.array([new FormControl('Where To?', [Validators.required])]),
            rideSchedule: ['0', [Validators.required]],
            rideDate: [this.minDate],
            rideTime: [this.minTime],
            carType: ['', [Validators.required]],
            bid: ['', [Validators.required, Validators.min(50)]],
            updateOn: 'blur'
        });
    }


    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
