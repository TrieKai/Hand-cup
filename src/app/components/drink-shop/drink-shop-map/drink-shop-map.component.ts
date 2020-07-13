import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import { GeolocationService } from 'src/app/service/geolocation.service';
import { MapService } from 'src/app/service/map.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { SharedService } from 'src/app/shared/shared.service';
import { DrinkShopService } from 'src/app/service/drink-shop.service';
import { HtmlElementService } from 'src/app/shared/html-element.service';

@Component({
    selector: 'app-drink-shop-map',
    templateUrl: './drink-shop-map.component.html',
    styleUrls: ['./drink-shop-map.component.scss']
})
export class DrinkShopMapComponent implements OnInit {
    @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
    map: google.maps.Map;
    coordinate: Coordinate = { latitude: null, longitude: null };
    place: google.maps.places.PlacesService;
    distance: number;
    resultArray: drinkShopResults[] = [];
    isNextPage: boolean;
    currentMarker: google.maps.Marker;
    markers: google.maps.Marker[] = [];
    infoWindows: google.maps.InfoWindow[] = [];
    onloading: boolean;
    private sInput: any;

    constructor(
        private geolocationService: GeolocationService,
        private mapService: MapService,
        private cons: ConstantsService,
        private sharedService: SharedService,
        private drinkShopService: DrinkShopService,
        protected htmlElementService: HtmlElementService,
        private renderer: Renderer2,
    ) {
        this.coordinate = drinkShopService.currentCoordinate
    }

    ngOnInit() {
        this.onloading = this.sharedService.getSharedData(this.cons.SHAREDDATA.onloading);
        console.log('init', this.onloading)
        this.geolocationService.getPosition().then(pos => {
            console.log(`Positon: ${pos.lng} ${pos.lat}`);
            this.coordinate.longitude = pos.lng;
            this.coordinate.latitude = pos.lat;
            this.mapInitializer();
        });
    }

    mapInitializer() {
        const coordinates: google.maps.LatLng = new google.maps.LatLng(this.coordinate.latitude, this.coordinate.longitude);
        this.distance = 100; // default
        const mapOptions: google.maps.MapOptions = {
            center: coordinates,
            zoom: 15,
            mapTypeControl: false,
        };
        this.map = new google.maps.Map(this.gmap.nativeElement, mapOptions);

        this.currentMarker = new google.maps.Marker({
            position: coordinates,
            map: this.map,
        });
        this.currentMarker.setMap(this.map);
        this.mapIdleEvent();

        const randomControlDiv = this.renderer.createElement('div');
        this.randomControl(randomControlDiv);
        this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(randomControlDiv);

        this.setAutoComplete();
    }

    mapIdleEvent() {
        this.map.addListener('idle', () => {
            console.log('map idle')
            this.currentMarker.setMap(null); // Clear current marker
            const currentPosition = this.map.getCenter();
            this.currentMarker = new google.maps.Marker({
                position: currentPosition,
                map: this.map,
            });
            this.currentMarker.setMap(this.map);
            this.coordinate = { latitude: currentPosition.lat(), longitude: currentPosition.lng() };
            document.getElementById("searchBtn").style.display = 'block';
        });
    }

    randomControl(controlDiv: HTMLElement) {
        // Set CSS for the control border
        const controlUI = this.renderer.createElement('div');
        controlUI.id = 'searchBtn';
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click me!';
        this.renderer.appendChild(controlDiv, controlUI);

        // Set CSS for the control interior
        const controlText = this.renderer.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = '開始搜尋附近飲料店';
        this.renderer.appendChild(controlUI, controlText);

        controlUI.addEventListener('click', () => {
            this.getNearByLocations(); // Get data from backend microService
        });
    }

    setAutoComplete() {
        this.sInput = this.htmlElementService.get('searchInput');
        const autocomplete = new google.maps.places.Autocomplete(this.sInput.value);
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            console.log(place)
            if (!place.geometry) {
                window.alert("No details available for input: '" + place.name + "'");
                return;
            }

            // Clear out the old markers
            this.markers.forEach((marker) => {
                marker.setMap(null);
            });
            this.markers = [];

            // If the place has a geometry, then present it on a map
            if (place.geometry.viewport) {
                this.map.fitBounds(place.geometry.viewport);
            } else {
                this.map.setCenter(place.geometry.location);
                this.map.setZoom(17);
            }
            this.currentMarker.setPosition(place.geometry.location);
            this.currentMarker.setVisible(true);
        });
    }

    async getNearByLocations() {
        this.sharedService.setSharedData(this.cons.SHAREDDATA.onloading, true);
        const respData = await this.mapService.getNearByLocations(this.coordinate, this.distance);
        this.sharedService.setSharedData(this.cons.SHAREDDATA.onloading, false);
        console.log(respData)
        if (this.resultArray.length > 0) {
            this.resultArray = []; // Reset array
        }
        this.resultArray = this.drinkShopService.getTopLocation(this.coordinate, respData, 5); // 抓附近的五個地點
        console.log('resultArray:', this.resultArray)
        this.showAllLocation();
    }

    showAllLocation() {
        if (this.markers.length > 0) {
            this.markers.forEach(marker => marker.setMap(null));
            this.markers = [];
        }

        this.resultArray.map((result, index) => {
            const infoWindowData: InfoWindowData = {
                position: {
                    latitude: result.latitude,
                    longitude: result.longitude,
                },
                name: result.name,
                img: result.image_url,
                rating: result.rating,
                ratingNum: result.ratings_total,
                // openNow: result.opening_hours.open_now,
            };
            console.log(infoWindowData)
            this.addMarkerWithTimeout(infoWindowData, index * 1000).then((value) => {
                if (index + 1 === this.resultArray.length) {
                    // Switch scenes with a delay of 1500 ms
                    setTimeout(() => {
                        this.handleTransformScenes();
                    }, 1500);
                }
            });

            return result;
        });
    }

    async addMarkerWithTimeout(data: InfoWindowData, timeout: number) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const infoWindow = new google.maps.InfoWindow({
                    content:
                        '<div id="infoWindowBox">' +
                        '<div id="infoWindowImg" style="background-image: url(' + data.img + ');"></div>' +
                        '<div id="descriptionWrapper">' +
                        '<div><h1 id="titleName">' + data.name + '</h1></div>' +
                        '<div id="ratingWrapper">' +
                        '<span>' + data.rating + '</span>' +
                        '<ol id="ratingStarsWrapper">' + this.drinkShopService.handleRatingStar(data.rating) + '</ol>' +
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

                resolve('Mark successful!');
            }, timeout);
        });
    }

    handleTransformScenes() {
        console.log('transform')
        // TODO: Call parent component transform scenes
        this.drinkShopService.setSharedData(this.cons.SHAREDDATA.showMap, false);
        this.drinkShopService.setSharedData(this.cons.SHAREDDATA.drinkShopResults, this.resultArray);
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
