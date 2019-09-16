
import { MapsAPILoader } from '@agm/core';
import { Marker } from '@agm/core/services/google-maps-types';
import { Component, ElementRef, NgZone, OnInit, ViewChild, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

let goole: any;
@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

    @ViewChild('searchbar', { static: false, read: ElementRef }) searchbar: ElementRef;
    @ViewChild('serviceHelper', { static: false, read: ElementRef }) serviceHelper: ElementRef;
    placeService;
    // @ViewChild('searchbar', { static: false }) public searchElementRef: ElementRef;
    map: google.maps.Map;

    constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private router: Router, private storage: Storage) { }

    public latitude: number;
    public longitude: number;
    public searchControl: FormControl;

    ngOnInit() {
        // set google maps defaults
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
                // get the place result
                place = autocomplete.getPlace();
                // verify result
                if (place.geometry === undefined || place.geometry === null) {
                    return;
                }
                // set latitude, longitude and zoom
                this.latitude = place.geometry.location.lat();
                this.longitude = place.geometry.location.lng();
                console.log(place);
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
        }
    }

    private fetchPlaceDetails(location: google.maps.LatLng) {
        let geoCoderService = new google.maps.Geocoder();
        let geocoderRequest: google.maps.GeocoderRequest = {
            location: new google.maps.LatLng(this.latitude, this.longitude)
        };
        geoCoderService.geocode(geocoderRequest,this.updatePlaceName)
        this.placeService = new google.maps.places.AutocompleteService();
        let request: google.maps.places.QueryAutocompletionRequest = {
            location: new google.maps.LatLng(this.latitude, this.longitude),
            input: ''
        }
       // this.placeService.getQueryPredictions(request, this.updatePlaceName)
    }

    private updatePlaceName(results:any[], status: any) {
        console.log(results, status);
    }
    markerDragEnd(m: Marker, $event: MouseEvent) {
        console.log('dragEnd', m, $event);
        const location = new google.maps.LatLng($event['coords']['lat'], $event['coords']['lng'])
        this.fetchPlaceDetails(location);
    }

}
