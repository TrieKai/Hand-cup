import { Component, OnInit, OnDestroy, ViewChild, ElementRef, isDevMode, Inject } from '@angular/core';
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

import { ConfirmComponent } from '../../components/common/confirm/confirm.component';

@Component({
  selector: 'app-my-map',
  templateUrl: './my-map.component.html',
  styleUrls: ['./my-map.component.scss']
})
export class MyMapComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) gmap: ElementRef<HTMLDivElement>;
  infoMessage: string;
  map: google.maps.Map;
  coordinate: Coordinate = { latitude: null, longitude: null };
  favMarkers: google.maps.Marker[] = [];
  visMarkers: google.maps.Marker[] = [];
  mixMarkers: google.maps.Marker[] = [];
  myMapList: MyMap;
  sharedSubscribe: Subscription;
  userId: string;
  userDataBS: BehaviorSubject<any>;
  loginSubscribe: Subscription;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private cons: ConstantsService,
    private geolocationService: GeolocationService,
    private sharedService: SharedService,
    private mapService: MapService,
    private message: MessageService,
    private loginService: LoginService,
    private domService: DomService,
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

          this.favMarkers.forEach((favMarker) => { favMarker.setMap(null); });
          this.visMarkers.forEach((visMarker) => { visMarker.setMap(null); });
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
    this.sharedService.setStatus(this.cons.SHAREDSTATUS.onloading, true);
    this.myMapList = await this.mapService.getMyMapList(this.userId);
    this.sharedService.setStatus(this.cons.SHAREDSTATUS.onloading, false);
    if (isDevMode() || global.showLog) {
      console.log(this.myMapList);
    }
    this.showMarks();
  }

  async showMarks() {
    if (!this.myMapList.favorites && !this.myMapList.visiteds) {
      this.message.add({ type: this.cons.MESSAGE_TYPE.warn, title: '您似乎是還沒收藏店家唷~', content: '' });
      return;
    }
    if (this.myMapList.favorites && this.myMapList.favorites instanceof Array) {
      this.myMapList.favorites.forEach((favorite) => {
        const marker = new google.maps.Marker({
          position: { lat: favorite.latitude, lng: favorite.longitude },
          map: this.map,
          icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          animation: google.maps.Animation.DROP,
        });
        marker.setMap(this.map);
        this.favMarkers.push(marker); // 統一管理 marker
      });
    }
    if (this.myMapList.visiteds && this.myMapList.visiteds instanceof Array) {
      this.myMapList.visiteds.forEach((visited) => {
        const marker = new google.maps.Marker({
          position: { lat: visited.latitude, lng: visited.longitude },
          map: this.map,
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          animation: google.maps.Animation.DROP,
        });
        marker.setMap(this.map);
        this.visMarkers.push(marker); // 統一管理 marker
      });
    }

    this.handleClusterMarkers();
  }

  handleClusterMarkers() {
    // Handle mix markers
    for (let i = 0; i < this.favMarkers.length; i++) {
      for (let j = 0; j < this.visMarkers.length; j++) {
        if (this.favMarkers[i].getPosition().equals(this.visMarkers[j].getPosition())) {
          const mixMarker = new google.maps.Marker({
            position: { lat: this.favMarkers[i].getPosition().lat(), lng: this.favMarkers[i].getPosition().lng() },
            map: this.map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
            animation: google.maps.Animation.DROP,
          });
          mixMarker.setMap(this.map);
          this.mixMarkers.push(mixMarker);

          // Delete same position elememt from array
          this.favMarkers[i].setMap(null);
          this.favMarkers.splice(i, 1);
          i--;
          this.visMarkers[j].setMap(null);
          this.visMarkers.splice(j, 1);
          j--;
          break;
        }
      }
    }

    const allMarkers = this.favMarkers.concat(this.visMarkers).concat(this.mixMarkers);
    new MarkerClusterer(this.map, allMarkers, {
      imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    });
  }
}
