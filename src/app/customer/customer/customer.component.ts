import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PricingService } from 'src/app/providers/pricing.service';
import { RideEstimate, Location } from 'src/app/models';
import { Subscription } from 'rxjs';
import {CarType} from '../../enums';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit, OnDestroy {
  CarType=CarType;
  rideEstimateList: RideEstimate[] = [];
  startLocation: Location;
  destination: Location;
  subscription: Subscription = new Subscription();
  constructor(private router: Router, private pricingService: PricingService) { }

  ngOnInit() {
    this.subscription.add(this.pricingService.fetchRideEstimate(this.startLocation, this.destination).subscribe((result: RideEstimate[]) => {
      this.rideEstimateList = result;
    }));
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
