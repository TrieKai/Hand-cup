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
    infoWindows: google.maps.InfoWindow[] = [];

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
            zoom: 17,
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
            radius: 5,
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
                const infoWindowData: InfoWindowData = {
                    position: {
                        latitude: result.geometry.location.lat(),
                        longitude: result.geometry.location.lng(),
                    },
                    name: result.name,
                    img: result.photos[0] ? result.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 }) : null,
                    rating: result.rating,
                    // openNow: result.opening_hours.open_now,
                };
                // const img = null;
                console.log(infoWindowData)
                this.addMarkerWithTimeout(infoWindowData, index * 400);
            });
        }
    }

    addMarkerWithTimeout(data: InfoWindowData, timeout: number) {
        window.setTimeout(() => {
            const infoWindow = new google.maps.InfoWindow({
                content:
                    '<div id="infoWindow" class="infoWindow">' +
                    '<div id="infoWindowImg" class="infoWindowImg" style="background-image: url(' + data.img + ');"></div>' +
                    '<span>' + data.name + '</span>' +
                    '<span>' + data.rating + '</span>' +
                    '<div>' +
                    this.handleRatingStar(data.rating) +
                    '</div>' +
                    '</div>'
            });
            this.infoWindows.push(infoWindow); // 統一管理 infoWindow

            const marker = new google.maps.Marker({
                position: { lat: data.position.latitude, lng: data.position.longitude },
                map: this.map,
                icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
                animation: google.maps.Animation.DROP,
            });
            this.markers.push(marker); // 統一管理 marker

            marker.addListener('click', () => {
                this.hideAllInfoWindows();
                infoWindow.open(this.map, marker);
            });
        }, timeout);
    }

    handleRatingStar(rating: number) {
        const ratings = rating * 10 + 2; // 加二是因為好計算
        const ratingStars = Math.floor(ratings / 5) / 2; // 標準化成得到的星星數
        const fullStars = Math.floor(ratingStars); // 滿星的數量
        const halfStars = (ratingStars - fullStars) * 2; // 半星的數量
        const emptyStars = 5 - fullStars - halfStars; // 空星的數量
        let starContent: string = '';

        console.log(fullStars, halfStars, emptyStars)
        for (let i: number = 0; i < fullStars; i++) {
            starContent = starContent + '<div style="width:25px; height:25px; background-image: url(http://maps.gstatic.com/consumer/images/icons/2x/ic_star_rate_14.png);"></div>';
        }
        if (halfStars) {
            starContent = starContent + '<div style="width:25px; height:25px; background-image: url(http://maps.gstatic.com/consumer/images/icons/2x/ic_star_rate_half_14.png);"></div>';
        }
        if (emptyStars) {
            for (let i: number = 0; i < emptyStars; i++) {
                starContent = starContent + '<div style="width:25px; height:25px; background-image: url(http://maps.gstatic.com/consumer/images/icons/2x/ic_star_rate_empty_14.png);"></div>';
            }
        }

        return starContent;
    }

    hideAllInfoWindows() {
        // 關掉全部的 InfoWindow
        this.infoWindows.forEach(infoWindow => {
            infoWindow.close();
        })
    }
}
