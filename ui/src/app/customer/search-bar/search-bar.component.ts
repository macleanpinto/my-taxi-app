
import { MapsAPILoader } from '@agm/core';
import { FitBoundsService } from '@agm/core/services/fit-bounds';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, InjectionToken, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustStore } from '../customer.store';
import { Store } from 'redux';
import { CustomerState } from '../customer.state';
import { RideSearchRequest } from 'src/app/models';
import * as CustomerActions from '../customer.actions';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  providers: [FitBoundsService, Geolocation]
})
export class SearchBarComponent implements OnInit, OnDestroy {


  @ViewChild('searchbar', { static: false, read: ElementRef }) searchbar: ElementRef;
  @ViewChild('serviceHelper', { static: false, read: ElementRef }) serviceHelper: ElementRef;
  map: google.maps.Map;

  constructor(
    private mapsAPILoader: MapsAPILoader, private router: Router,
    private geolocation: Geolocation,
    @Inject(CustStore) private store: Store<CustomerState>) {
    store.subscribe(() => this.readState());
    this.readState();
  }

  private unsubscribe: Subject<void> = new Subject();
  private fieldName: string;
  private index: number;
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl = new FormControl('', [Validators.required]);
  private rideSearchRequest: RideSearchRequest;

  ngOnInit(): void {
    this.router.events
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          if (this.router.getCurrentNavigation().extras.state) {
            this.fieldName = this.router.getCurrentNavigation().extras.state.data.field;
            this.index = this.router.getCurrentNavigation().extras.state.data.index;
          }
        }
      });
  }
  ionViewWillEnter(): void {
    const searchInput = this.searchbar.nativeElement.querySelector('.searchbar-input');
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
        this.updateReduxStore(place);
      });
    });

    this.setCurrentPosition();

  }

  readState() {
    const state: CustomerState = this.store.getState();
    this.rideSearchRequest = Object.assign({}, state.rideSearchRequest);
  }
  markerDragEnd($event: any): void {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.fetchPlaceDetails();
  }
  navigateToHome() {
    this.router.navigate(['/']);
  }

  private setCurrentPosition(): void {
    this.geolocation.getCurrentPosition().then((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.fetchPlaceDetails();
    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }

  private fetchPlaceDetails(): void {
    const geoCoderService = new google.maps.Geocoder();
    const geocoderRequest: google.maps.GeocoderRequest = {
      location: new google.maps.LatLng(this.latitude, this.longitude)
    };
    geoCoderService.geocode(geocoderRequest, this.updatePlaceName.bind(this));

  }

  private updatePlaceName(results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus): void {
    this.searchControl.setValue(results[0].formatted_address);
    this.updateReduxStore(results[0]);
  }

  private updateReduxStore(place): void {
    switch (this.fieldName) {
      case 'from': {
        this.rideSearchRequest.pickupLocation[this.index] = place;
        break;
      }
      case 'to': {
        this.rideSearchRequest.dropLocation[this.index] = place;
        break;
      }
      default: {
        break;
      }
    }
    this.store.dispatch(CustomerActions.create(this.rideSearchRequest));
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}

