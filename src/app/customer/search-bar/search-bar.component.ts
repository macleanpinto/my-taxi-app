/// <reference types="@types/googlemaps" />
import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { IonSearchbar } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {

  @ViewChild('searchbar', { static: false, read: ElementRef }) searchbar: ElementRef;
  // @ViewChild('searchbar', { static: false }) public searchElementRef: ElementRef;
  map: google.maps.Map;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private router: Router, private storage: Storage) { }

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;

  ngOnInit() {
    // set google maps defaults
    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    // create search FormControl
    this.searchControl = new FormControl();

    // set current position
    this.setCurrentPosition();
  }

  ionViewWillEnter() {
    const fieldValue = history.state.data;
    var searchInput = this.searchbar.nativeElement.querySelector('.searchbar-input');
    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(searchInput, {
        types: ['address']
      });
      let place: google.maps.places.PlaceResult;
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          place = autocomplete.getPlace();
          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          // set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
          this.storage.set(fieldValue.field + '', JSON.parse(JSON.stringify(place))).then(success => console.log('Place', success));
          this.router.navigate(['/']);
        });
      });
    });

  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

}
