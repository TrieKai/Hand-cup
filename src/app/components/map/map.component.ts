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
            // this.getNearByLocations(); // Get data from backend microService
            this.getNearByLocationsByFrontend(); // Get data from frontend Google API
        });
    }

    mapInitializer() {
        // this.coordinates = new google.maps.LatLng(this.coordinate.latitude, this.coordinate.longitude);
        this.coordinates = new google.maps.LatLng(24.987004, 121.514250);
        const mapOptions: google.maps.MapOptions = {
            center: this.coordinates,
            zoom: 16,
        };
        const marker = new google.maps.Marker({
            position: this.coordinates,
            map: this.map,
        });
        this.map = new google.maps.Map(this.gmap.nativeElement, mapOptions);
        marker.setMap(this.map);
    }

    async getNearByLocations() {
        const resp = await this.mapService.getNearByLocations(this.coordinates);
        console.log(resp)
    }

    async getNearByLocationsByFrontend() {
        const request = {
            location: { lat: 24.987004, lng: 121.514250 },
            radius: 50,
            name: '飲料',
        };
        await this.mapService.getNearByLocationsByFrontend(this.map, request, this.NearbySearchCallback.bind(this));
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
        } else {
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
                    // img: result.photos[0] ? result.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 }) : null,
                    img: 'https://lh3.googleusercontent.com/p/AF1QipMXCg4FpZlTer6zgT_khxgAu-4YsJEjv5d1wtRG=s1600-w400-h300',
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
                    '<div id="infoWindowBox">' +
                    '<div id="infoWindowImg" style="background-image: url(' + data.img + ');"></div>' +
                    '<div id="descriptionWrapper">' +
                    '<div><h1 id="titleName">' + data.name + '</h1></div>' +
                    '<div id="ratingWrapper">' +
                    '<span>' + data.rating + '</span>' +
                    '<ol id="ratingStarsWrapper">' + this.handleRatingStar(data.rating) + '</ol>' +
                    '</div>' +
                    '</div>' +
                    '</div>',
                maxWidth: 400,
            });
            google.maps.event.addListener(infoWindow, 'domready', this.handleInfoWindow)
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
        const ratings: number = rating * 10 + 2; // 加二是因為好計算
        const ratingStars: number = Math.floor(ratings / 5) / 2; // 標準化成得到的星星數
        const fullStars: number = Math.floor(ratingStars); // 滿星的數量
        const halfStars: number = (ratingStars - fullStars) * 2; // 半星的數量
        const emptyStars: number = 5 - fullStars - halfStars; // 空星的數量
        let starContent: string = '';

        console.log(fullStars, halfStars, emptyStars)
        for (let i: number = 0; i < fullStars; i++) {
            starContent = starContent + '<li class="ratingStar" style="background-image: url(' + this.cons.GOOGLE_ICON_BASE_URL + '2x/ic_star_rate_14.png);"></li>';
        }
        if (halfStars) {
            starContent = starContent + '<li class="ratingStar" style="background-image: url(' + this.cons.GOOGLE_ICON_BASE_URL + '2x/ic_star_rate_half_14.png);"></li>';
        }
        if (emptyStars) {
            for (let i: number = 0; i < emptyStars; i++) {
                starContent = starContent + '<li class="ratingStar" style="background-image: url(' + this.cons.GOOGLE_ICON_BASE_URL + '2x/ic_star_rate_empty_14.png);"></li>';
            }
        }

        return starContent;
    }

    handleInfoWindow() {
        const infoWindowWrapperElement = document.getElementsByClassName('gm-style-iw-c')[0] as HTMLElement; // google infoWindow 最外面
        const infoWindowcontainerElement = document.getElementsByClassName('gm-style-iw-d')[0] as HTMLElement; // google infowindow 裡層
        const infoWindowBoxElement = document.getElementById('infoWindowBox'); // 自己寫的 infowindow box
        const infoWindowImgElement = document.getElementById('infoWindowImg'); // image in infowindow
        const descriptionWrapperElement = document.getElementById('descriptionWrapper');
        const titleNameElement = document.getElementById('titleName');
        const ratingWrapperElement = document.getElementById('ratingWrapper');
        const ratingStarsWrapperElement = document.getElementById('ratingStarsWrapper');
        const ratingStarElementList = document.getElementsByClassName('ratingStar');

        infoWindowWrapperElement.style.padding = '0px';
        infoWindowcontainerElement.style.overflow = 'hidden'; // 去掉 infoWidow scroll 效果

        infoWindowBoxElement.style.width = '400px';
        infoWindowBoxElement.style.height = '300px';

        descriptionWrapperElement.style.padding = '16px 24px';

        titleNameElement.style.margin = '0';
        titleNameElement.style.fontSize = '1.375rem';
        titleNameElement.style.fontWeight = '600';
        titleNameElement.style.lineHeight = '1.75rem';

        ratingWrapperElement.style.marginTop = '8px';
        ratingWrapperElement.style.display = 'flex';
        ratingWrapperElement.style.alignItems = 'center';

        ratingStarsWrapperElement.style.display = 'inline-flex';
        ratingStarsWrapperElement.style.display = '-webkit-inline-flex';
        ratingStarsWrapperElement.style.paddingLeft = '6px';

        Array.prototype.forEach.call(ratingStarElementList, (ratingStarElement: ElementCSSInlineStyle) => {
            ratingStarElement.style.backgroundSize = '14px 14px';
            ratingStarElement.style.width = '14px';
            ratingStarElement.style.height = '13px';
            ratingStarElement.style.display = 'inline-block';
        });

        infoWindowImgElement.style.backgroundPosition = 'center center';
        infoWindowImgElement.style.backgroundSize = 'cover';
        infoWindowImgElement.style.width = '100%';
        infoWindowImgElement.style.height = '70%';
    }

    hideAllInfoWindows() {
        // 關掉全部的 InfoWindow
        this.infoWindows.forEach(infoWindow => {
            infoWindow.close();
        })
    }
}
