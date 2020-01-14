import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { GeolocationService } from 'src/app/service/geolocation.service';
import { MapService } from 'src/app/service/map.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
    @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
    map: google.maps.Map;
    coordinate: Coordinate = { latitude: null, longitude: null };
    place: google.maps.places.PlacesService;
    coordinates: any;
    resultArray: object[] = [];

    constructor(
        private geolocationService: GeolocationService,
        private mapService: MapService,
        private cons: ConstantsService,
    ) { }

    ngOnInit() {
        this.geolocationService.getPosition().then(pos => {
            console.log(`Positon: ${pos.lng} ${pos.lat}`);
            this.coordinate.longitude = pos.lng;
            this.coordinate.latitude = pos.lat;
            this.mapInitializer();
            this.getNearByLocations();
        });
    }

    mapInitializer() {
        this.coordinates = new google.maps.LatLng(this.coordinate.latitude, this.coordinate.longitude);
        const mapOptions: google.maps.MapOptions = {
            center: this.coordinates,
            zoom: 15,
        };
        const marker = new google.maps.Marker({
            position: this.coordinates,
            map: this.map,
        });
        this.map = new google.maps.Map(this.gmap.nativeElement, mapOptions);
        marker.setMap(this.map);
    }

    async getNearByLocations() {
        const request = {
            location: this.coordinates,
            radius: 400,
            name: '飲料',
        };
        await this.mapService.getNearByLocations(this.map, request, this.NearbySearchCallback.bind(this));
    }

    NearbySearchCallback(
        results: google.maps.places.PlaceResult[],
        status: google.maps.places.PlacesServiceStatus,
        pagination: google.maps.places.PlaceSearchPagination
    ) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log('nearby search status:', status)
            this.getTotalData(results);
        } else if (status === google.maps.places.PlacesServiceStatus.NOT_FOUND) {
            console.log('nearby search status:', status)
        }

        if (pagination.hasNextPage) {
            pagination.nextPage();
        } else {
            console.log('No more page!')
        }
    }

    getTotalData(results: google.maps.places.PlaceResult[]) {
        results.map(item => {
            this.resultArray.push(item)
        });
        console.log(this.resultArray)
    }
}
