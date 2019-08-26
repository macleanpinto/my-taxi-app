/// <reference types="@types/googlemaps" />
import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { IonSearchbar } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {

  // @ViewChild('searchbar', { static: false, read: ElementRef }) private searchElementRef: IonSearchbar;
  @ViewChild('searchbar', { static: false }) public searchElementRef: ElementRef;
  map: google.maps.Map;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private router: Router) { }

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;

  ngOnInit() {
    const fieldValue = history.state.data;
    console.log('ff', fieldValue.field)
    // set google maps defaults
    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    // create search FormControl
    this.searchControl = new FormControl();

    // set current position
    this.setCurrentPosition();

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      // let autocomplete;
      // this.searchElementRef.getInputElement().then((input: HTMLInputElement) => {
      //   console.log('Input', input)
      //   autocomplete = new google.maps.places.Autocomplete(input, {
      //     types: ['address']
      //   });
      // });
      // const searchInput = this.searchElementRef.nativeElement.querySelector('.searchbar-input');
      console.log('Search input', this.searchElementRef.nativeElement);
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
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
