import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit, AfterViewInit {

  pickUpInput = 'Pickup From?';
  destionationInput = 'Where to?';
  sourcePlace: google.maps.places.PlaceResult;
  destinationPlace: google.maps.places.PlaceResult;
  constructor(private router: Router, private storage: Storage) { }

  ngOnInit() { }

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
}
