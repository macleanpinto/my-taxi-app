import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { Location, RideEstimate } from 'src/app/models';
import { PricingService } from 'src/app/providers/pricing.service';
import { CarType } from '../../enums';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit, AfterViewInit {

  pickUpInput = 'Pickup From?';
  destionationInput = 'Where to?';
  sourcePlace: google.maps.places.PlaceResult;
  destinationPlace: google.maps.places.PlaceResult;
  CarType = CarType;
  rideEstimateList: RideEstimate[] = [];
  startLocation: Location;
  destination: Location;
  subscription: Subscription = new Subscription();
  constructor(private router: Router, private pricingService: PricingService, private storage: Storage) { }

  ngOnInit() {
    this.subscription.add(this.pricingService.fetchRideEstimate(this.startLocation, this.destination).subscribe((result: RideEstimate[]) => {
      this.rideEstimateList = result;
    }));
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    console.log(this.storage.keys)
    this.storage.get('source').then(val => {
      if (val) {
        this.sourcePlace = val;
        this.pickUpInput = this.sourcePlace.name;
      }
    });
    this.storage.get('destination').then(val => {
      if (val) {
        this.destinationPlace = val;
        this.destionationInput = this.destinationPlace.name;
      }
    });
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter')
  }
  ngAfterViewInit(): void {
    console.log('Hello - after view')
  }

  pickLocation(direction: string) {
    this.router.navigate(['/search'], { state: { data: { field: direction } } });
  }

  segmentChanged($event) {
    console.log($event);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
