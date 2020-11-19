import { Component, OnInit, ViewChild, ElementRef, isDevMode } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';

import { ConstantsService } from 'src/app/util/constants/constants.service';
import { GeolocationService } from 'src/app/service/geolocation.service';
import { SharedService } from 'src/app/shared/shared.service';
import { GlobalService as global } from 'src/app/service/global.service';
import { MapService } from 'src/app/service/map.service';

@Component({
  selector: 'app-my-map',
  templateUrl: './my-map.component.html',
  styleUrls: ['./my-map.component.scss']
})
export class MyMapComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) gmap: ElementRef<HTMLDivElement>;
  infoMessage: string;
  map: google.maps.Map;
  coordinate: Coordinate = { latitude: null, longitude: null };
  markers: google.maps.Marker[] = [];
  myMapList: MyMap;
  sharedSubscribe: Subscription;
  userId: string;
  userDataBS: BehaviorSubject<any>;

  constructor(
    private cons: ConstantsService,
    private geolocationService: GeolocationService,
    private sharedService: SharedService,
    private mapService: MapService,
  ) { }

  ngOnInit() {
    this.infoMessage = this.cons.INFO_MESSAGE.myMap;
    this.geolocationService.getPosition()
      .then(pos => {
        console.log(`Positon: ${pos.lng} ${pos.lat}`);
        this.coordinate.longitude = pos.lng;
        this.coordinate.latitude = pos.lat;
        this.mapInitializer();
      });
    this.userDataBS = this.sharedService.getSharedData(this.cons.SHAREDDATA.userData);
    this.userDataBS.subscribe((userData) => {
      if (userData) {
        this.userId = userData.uid;
        this.initData();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userDataBS) {
      this.sharedService.deleteSharedData(this.cons.SHAREDDATA.userData);
      this.userDataBS.unsubscribe();
    }
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

  async initData() {
    this.sharedService.setStatus(this.cons.SHAREDSTATUS.onloading, true);
    this.myMapList = await this.mapService.getMyMapList(this.userId);
    this.sharedService.setStatus(this.cons.SHAREDSTATUS.onloading, false);
    if (isDevMode() || global.showLog) {
      console.log(this.myMapList);
    }
    this.showMarks();
  };

  async showMarks() {
    if (this.myMapList.favorites.length === 0 && this.myMapList.visiteds.length === 0) {
      alert('沒有東西啦哭哭')
      return;
    }

    this.myMapList.favorites.forEach((favorite) => {
      const marker = new google.maps.Marker({
        position: { lat: favorite.latitude, lng: favorite.longitude },
        map: this.map,
        icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        animation: google.maps.Animation.DROP,
      });
      marker.setMap(this.map);
      this.markers.push(marker); // 統一管理 marker
    });
    this.myMapList.visiteds.forEach((visited) => {
      const marker = new google.maps.Marker({
        position: { lat: visited.latitude, lng: visited.longitude },
        map: this.map,
        icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        animation: google.maps.Animation.DROP,
      });
      marker.setMap(this.map);
      this.markers.push(marker); // 統一管理 marker
    });
  }
}
