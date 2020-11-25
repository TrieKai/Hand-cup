import { Component, OnInit, OnDestroy, ViewChild, ElementRef, isDevMode, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subscription, BehaviorSubject } from 'rxjs';

import MarkerClusterer from '@googlemaps/markerclustererplus';

import { ConstantsService } from 'src/app/util/constants/constants.service';
import { GeolocationService } from 'src/app/service/geolocation.service';
import { SharedService } from 'src/app/shared/shared.service';
import { GlobalService as global } from 'src/app/service/global.service';
import { MapService } from 'src/app/service/map.service';
import { MessageService } from 'src/app/service/message.service';
import { LoginService } from 'src/app/service/login.service';
import { DomService } from 'src/app/util/dom.service';
import { DrinkShopService } from 'src/app/service/drink-shop.service';

import { ConfirmComponent } from '../../components/common/confirm/confirm.component';

@Component({
  selector: 'app-my-map',
  templateUrl: './my-map.component.html',
  styleUrls: ['./my-map.component.scss']
})
export class MyMapComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) gmap: ElementRef<HTMLDivElement>;
  @ViewChild('filterContent', { static: false }) filterContentRef: ElementRef<HTMLDivElement>;
  infoMessage: string;
  map: google.maps.Map;
  coordinate: Coordinate = { latitude: null, longitude: null };
  myMapList: MyMap;
  favMapList: MyMapContent[];
  visMapList: MyMapContent[];
  mixMapList: MyMapContent[];
  favMarkers: google.maps.Marker[] = [];
  visMarkers: google.maps.Marker[] = [];
  mixMarkers: google.maps.Marker[] = [];
  markerClusterer: MarkerClusterer;
  sharedSubscribe: Subscription;
  userId: string;
  userDataBS: BehaviorSubject<any>;
  loginSubscribe: Subscription;
  favCheck: boolean = true;
  visCheck: boolean = true;
  mixCheck: boolean = true;
  filterStatus: boolean = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private cons: ConstantsService,
    private geolocationService: GeolocationService,
    private sharedService: SharedService,
    private mapService: MapService,
    private message: MessageService,
    private loginService: LoginService,
    private domService: DomService,
    private drinkShopService: DrinkShopService,
    private renderer: Renderer2,
  ) { }

  ngOnInit() {
    this.infoMessage = this.cons.INFO_MESSAGE.myMap;
    this.initData();
  }

  ngOnDestroy(): void {
    if (this.userDataBS) {
      this.sharedService.deleteSharedData(this.cons.SHAREDDATA.userData);
      this.userDataBS.unsubscribe();
    }
  }

  async initData() {
    await this.geolocationService.getPosition()
      .then(pos => {
        console.log(`Positon: ${pos.lng} ${pos.lat}`);
        this.coordinate.longitude = pos.lng;
        this.coordinate.latitude = pos.lat;
        this.mapInitializer();
      });

    this.loginSubscribe = this.loginService.checkUserLoggedIn()
      .subscribe(status => {
        if (status === null) { return; }
        if (status) {
          this.userDataBS = this.sharedService.getSharedData(this.cons.SHAREDDATA.userData);
          this.userDataBS.subscribe(userData => {
            if (userData) {
              this.userId = userData.uid;
              this.getMyMapList();
            }
          });
        } else {
          const componentRef = this.domService.createComponent(
            ConfirmComponent,
            this.cons.SHAREDCOMPONENT.confirmComponentRef,
            { closeButton: false, cancelButton: false, title: '', message: '請先登入~' }
          );
          this.domService.attachComponent(componentRef, this.document.body);

          this.favMarkers.forEach(favMarker => { favMarker.setMap(null); });
          this.visMarkers.forEach(visMarker => { visMarker.setMap(null); });
        }
      });
  }

  mapInitializer() {
    const coordinates: google.maps.LatLng = new google.maps.LatLng(this.coordinate.latitude, this.coordinate.longitude);
    const mapOptions: google.maps.MapOptions = {
      center: coordinates,
      zoom: 11,
      mapTypeControl: false,
    };
    this.map = new google.maps.Map(this.gmap.nativeElement, mapOptions);
  }

  async getMyMapList() {
    // TODO: Fix unknown loading error
    // this.sharedService.setStatus(this.cons.SHAREDSTATUS.onloading, true);
    this.myMapList = await this.mapService.getMyMapList(this.userId);
    // this.sharedService.setStatus(this.cons.SHAREDSTATUS.onloading, false);
    if (isDevMode() || global.showLog) {
      console.log(this.myMapList);
    }
    this.initMarkers();
  }

  initMarkers() {
    if (!this.myMapList.favorites && !this.myMapList.visiteds) {
      this.message.add({ type: this.cons.MESSAGE_TYPE.warn, title: '您似乎是還沒收藏店家唷~', content: '' });
      return;
    }
    this.classifyMapDataList();

    this.showFavMarkers();
    this.showVisMarkers();
    this.showMixMarkers();

    this.handleClusterMarkers();
  }

  showMarkers(type: number, event?: any) {
    switch (type) {
      case 1:
        this.favCheck = !this.favCheck;
        if (this.favCheck) {
          this.showFavMarkers();
        } else {
          this.favMarkers.forEach(fav => { fav.setMap(null); });
          this.favMarkers = [];
        }
        break;
      case 2:
        this.visCheck = !this.visCheck;
        if (this.visCheck) {
          this.showVisMarkers();
        } else {
          this.visMarkers.forEach(vis => { vis.setMap(null); });
          this.visMarkers = [];
        }
        break;
      case 3:
        this.mixCheck = !this.mixCheck;
        if (this.mixCheck) {
          this.showMixMarkers();
        } else {
          this.mixMarkers.forEach(mix => { mix.setMap(null); });
          this.mixMarkers = [];
        }
        break;
    }

    this.handleClusterMarkers();
  }

  showFavMarkers() {
    this.favMapList.forEach(fav => {
      const marker = new google.maps.Marker({
        position: { lat: fav.latitude, lng: fav.longitude },
        map: this.map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        animation: google.maps.Animation.DROP,
      });
      marker.setMap(this.map);
      this.favMarkers.push(marker); // 統一管理 marker
      this.handleInfoWindow({
        position: { latitude: fav.latitude, longitude: fav.longitude },
        name: fav.name,
        img: fav.image,
        rating: fav.rating,
        ratingNum: fav.ratings_total,
        views: fav.views,
      }, marker, 'fav');
    });
  }

  showVisMarkers() {
    this.visMapList.forEach(vis => {
      const marker = new google.maps.Marker({
        position: { lat: vis.latitude, lng: vis.longitude },
        map: this.map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        animation: google.maps.Animation.DROP,
      });
      marker.setMap(this.map);
      this.visMarkers.push(marker); // 統一管理 marker
      this.handleInfoWindow({
        position: { latitude: vis.latitude, longitude: vis.longitude },
        name: vis.name,
        img: vis.image,
        rating: vis.rating,
        ratingNum: vis.ratings_total,
        views: vis.views,
      }, marker, 'vis');
    });
  }

  showMixMarkers() {
    this.mixMapList.forEach(mix => {
      const marker = new google.maps.Marker({
        position: { lat: mix.latitude, lng: mix.longitude },
        map: this.map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
        animation: google.maps.Animation.DROP,
      });
      marker.setMap(this.map);
      this.mixMarkers.push(marker); // 統一管理 marker
      this.handleInfoWindow({
        position: { latitude: mix.latitude, longitude: mix.longitude },
        name: mix.name,
        img: mix.image,
        rating: mix.rating,
        ratingNum: mix.ratings_total,
        views: mix.views,
      }, marker, 'mix');
    });
  }

  classifyMapDataList() {
    this.favMapList = this.myMapList.favorites;
    this.visMapList = this.myMapList.visiteds;
    this.mixMapList = [];
    for (let i = 0; i < this.favMapList.length; i++) {
      for (let j = 0; j < this.visMapList.length; j++) {
        if (
          this.favMapList[i].latitude === this.visMapList[j].latitude &&
          this.favMapList[i].longitude === this.visMapList[j].longitude &&
          this.favMapList[i].name === this.visMapList[j].name
        ) {
          this.mixMapList.push(this.favMapList[i]);
          this.favMapList.splice(i, 1);
          i--;
          this.visMapList.splice(j, 1);
          j--;
          break;
        }
      }
    }
  }

  handleClusterMarkers() {
    if (this.markerClusterer) { this.markerClusterer.clearMarkers(); } // Clear cluster markers first

    let allMarkers: google.maps.Marker[] = [];
    if (this.favCheck) {
      allMarkers = allMarkers.concat(this.favMarkers);
    }
    if (this.visCheck) {
      allMarkers = allMarkers.concat(this.visMarkers);
    }
    if (this.mixCheck) {
      allMarkers = allMarkers.concat(this.mixMarkers);
    }
    this.markerClusterer = new MarkerClusterer(this.map, allMarkers, {
      imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    });
  }

  handleInfoWindow(data: InfoWindowData, marker: google.maps.Marker, type: string) {
    let typeName: string;
    switch (type) {
      case 'fav':
        typeName = '喜愛的店家';
        break;
      case 'vis':
        typeName = '曾經造訪的店家';
        break;
      case 'mix':
        typeName = '喜愛&曾經造訪的店家';
        break;
    }
    const infoWindow = new google.maps.InfoWindow({
      content:
        '<div id="infoWindowBox">' +
        '<div id="infoWindowImg" style="background-image: url(' + data.img + ');"></div>' +
        '<div id="descriptionWrapper">' +
        '<div id="typeName">' + typeName + '</div>' +
        '<div><h1 id="titleName">' + data.name + '</h1></div>' +
        '<div id="ratingWrapper">' +
        '<span>' + data.rating + '</span>' +
        '<ol id="ratingStarsWrapper">' + this.drinkShopService.handleRatingStar(data.rating) + '</ol>' +
        '</div>' +
        '</div>' +
        '</div>',
      maxWidth: 400,
    });
    google.maps.event.addListener(infoWindow, 'domready', this.infoWindowStyle);
    marker.addListener('click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  infoWindowStyle() {
    const infoWindowWrapperElement = document.getElementsByClassName('gm-style-iw-c')[0] as HTMLElement; // google infoWindow 最外面
    const infoWindowcontainerElement = document.getElementsByClassName('gm-style-iw-d')[0] as HTMLElement; // google infowindow 裡層
    const infoWindowBoxElement = document.getElementById('infoWindowBox'); // 自己寫的 infowindow box
    const infoWindowImgElement = document.getElementById('infoWindowImg'); // image in infowindow
    const descriptionWrapperElement = document.getElementById('descriptionWrapper');
    const typeNameElement = document.getElementById('typeName');
    const titleNameElement = document.getElementById('titleName');
    const ratingWrapperElement = document.getElementById('ratingWrapper');
    const ratingStarsWrapperElement = document.getElementById('ratingStarsWrapper');
    const ratingStarElementList = document.getElementsByClassName('ratingStar');

    infoWindowWrapperElement.style.padding = '0px';
    infoWindowcontainerElement.style.overflow = 'hidden'; // 去掉 infoWidow scroll 效果

    infoWindowBoxElement.style.width = '270px';
    infoWindowBoxElement.style.height = '270px';

    descriptionWrapperElement.style.padding = '15px 5px';

    typeNameElement.style.color = 'coral';
    typeNameElement.style.fontSize = '16px';

    titleNameElement.style.margin = '0';
    titleNameElement.style.fontSize = '1.375rem';
    titleNameElement.style.fontWeight = '600';
    titleNameElement.style.lineHeight = '1.75rem';

    ratingWrapperElement.style.marginTop = '8px';
    ratingWrapperElement.style.display = 'flex';
    ratingWrapperElement.style.alignItems = 'center';

    ratingStarsWrapperElement.style.display = 'inline-flex';
    ratingStarsWrapperElement.style.display = '-webkit-inline-flex';
    ratingStarsWrapperElement.style.display = '-ms-inline-flexbox';
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
    infoWindowImgElement.style.height = '50%';
  }

  handleFilter() {
    if (this.filterStatus) {
      this.renderer.removeClass(this.filterContentRef.nativeElement, 'open');
    } else {
      this.renderer.addClass(this.filterContentRef.nativeElement, 'open');
    }
    this.filterStatus = !this.filterStatus;
  }
}
