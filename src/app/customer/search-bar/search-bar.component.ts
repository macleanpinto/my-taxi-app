
import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Data, NavigationEnd, NavigationStart } from '@angular/router';
import { Storage } from '@ionic/storage';
import { FitBoundsService } from '@agm/core/services/fit-bounds';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  providers: [FitBoundsService]
})
export class SearchBarComponent implements OnInit, OnDestroy {


  @ViewChild('searchbar', { static: false, read: ElementRef }) searchbar: ElementRef;
  @ViewChild('serviceHelper', { static: false, read: ElementRef }) serviceHelper: ElementRef;
  map: google.maps.Map;

  constructor(private mapsAPILoader: MapsAPILoader, private router: Router, private storage: Storage, private route: ActivatedRoute) { }
  private unsubscribe: Subject<void> = new Subject();
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl = new FormControl('', [Validators.required]);
  private fieldName: string;


  ngOnInit(): void {
    this.router.events
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          if (this.router.getCurrentNavigation().extras.state) {
            this.fieldName = this.router.getCurrentNavigation().extras.state.data.field;
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
        this.storage.set(this.fieldName, JSON.parse(JSON.stringify(place)));
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
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.fetchPlaceDetails();
      });
    }
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
    this.storage.set(this.fieldName, JSON.parse(JSON.stringify(results[0])));
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}

