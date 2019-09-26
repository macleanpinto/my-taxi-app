
import { MapsAPILoader } from '@agm/core';
import { FitBoundsService } from '@agm/core/services/fit-bounds';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from 'src/app/data.service';

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
    private dataService: DataService, private geolocation: Geolocation) { }

  private unsubscribe: Subject<void> = new Subject();
  private fieldName: string;
  private index: number;
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl = new FormControl('', [Validators.required]);

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

  private updateReduxStore(place: google.maps.GeocoderResult | google.maps.places.PlaceResult): void {
    switch (this.fieldName) {
      case 'from': {
        this.dataService.source.push({ index: this.index, loc: place });
        break;
      }
      case 'to': {
        this.dataService.destination.push({ index: this.index, loc: place });
        break;
      }
      default: {
        break;
      }
    }
    this.dataService.notify.next(true);
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}

