import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { GeolocationService } from 'src/app/service/geolocation.service';
import { MapService } from 'src/app/service/map.service';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
    @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
    map: google.maps.Map;
    coordinate: Coordinate = { latitude: null, longitude: null };

    constructor(
        private geolocationService: GeolocationService,
        private mapService: MapService,
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
        const coordinates = new google.maps.LatLng(this.coordinate.latitude, this.coordinate.longitude);
        const mapOptions: google.maps.MapOptions = {
            center: coordinates,
            zoom: 15,
        };
        const marker = new google.maps.Marker({
            position: coordinates,
            map: this.map,
        });
        this.map = new google.maps.Map(this.gmap.nativeElement, mapOptions);
        marker.setMap(this.map);
    }

    async getNearByLocations() {
        const resp = await this.mapService.getNearByLocations();
        console.log(resp)
    }
}
