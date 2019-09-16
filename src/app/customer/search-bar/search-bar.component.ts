
import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit, AfterViewInit {

  @ViewChild('searchbar', { static: false, read: ElementRef }) searchbar: ElementRef;
  @ViewChild('serviceHelper', { static: false, read: ElementRef }) serviceHelper: ElementRef;
  map: google.maps.Map;

  constructor(private mapsAPILoader: MapsAPILoader, private router: Router, private storage: Storage) { }

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl = new FormControl('', [Validators.required]);

  ngOnInit() {
    // set google maps defaults
    this.latitude = 39.8282;
    this.longitude = -98.5795;
  }
  ngAfterViewInit() {
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
        // get the place result
        place = autocomplete.getPlace();
        // verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }
        // set latitude, longitude and zoom
        this.latitude = place.geometry.location.lat();
        this.longitude = place.geometry.location.lng();
        this.storage.set(fieldValue.field, JSON.parse(JSON.stringify(place)));
      });
    });

  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      });
      this.fetchPlaceDetails();
    }
  }

  private fetchPlaceDetails() {
    let geoCoderService = new google.maps.Geocoder();
    let geocoderRequest: google.maps.GeocoderRequest = {
      location: new google.maps.LatLng(this.latitude, this.longitude)
    };
    geoCoderService.geocode(geocoderRequest, this.updatePlaceName.bind(this));

  }

  private updatePlaceName(results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) {
    this.searchControl.setValue(results[0].formatted_address);
  }
  markerDragEnd($event: MouseEvent) {
    this.latitude = $event['coords']['lat'];
    this.longitude = $event['coords']['lng'];
    this.fetchPlaceDetails();
  }

}
