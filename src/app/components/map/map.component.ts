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
    coordinates: google.maps.LatLng;
    resultArray: google.maps.places.PlaceResult[] = [];
    isNextPage: boolean;
    markers: google.maps.Marker[] = [];

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
            radius: 500,
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
            if (pagination.hasNextPage) {
                this.isNextPage = true;
                pagination.nextPage();
            } else {
                console.log('No more page!')
                this.isNextPage = false;
            }
            this.getTotalData(results);
            this.showAllLocation();
        } else if (status === google.maps.places.PlacesServiceStatus.NOT_FOUND) {
            console.log('nearby search status:', status)
        }
    }

    getTotalData(results: google.maps.places.PlaceResult[]) {
        results.map(result => {
            this.resultArray.push(result)
        });
        console.log(this.resultArray)
    }

    showAllLocation() {
        if (!this.isNextPage) {
            this.resultArray.map((result, index) => {
                const lat = result.geometry.location.lat();
                const lng = result.geometry.location.lng();
                const img = result.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 });
                // const img = null;
                console.log(lat, lng)
                this.addMarkerWithTimeout(lat, lng, index * 500, img);
            });
        }
    }

    addMarkerWithTimeout(lat: number, lng: number, timeout: number, img: string) {
        window.setTimeout(() => {
            const infoWindow = new google.maps.InfoWindow({
                content: '<div><img src=' + img + '/></div>'
            });
            const marker = new google.maps.Marker({
                position: { lat: lat, lng: lng },
                map: this.map,
                icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
                animation: google.maps.Animation.DROP,
            });
            this.markers.push(marker);
            marker.addListener('click', () => {
                infoWindow.open(this.map, marker);
            });
        }, timeout);
    }
}
