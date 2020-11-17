import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { ConstantsService } from 'src/app/util/constants/constants.service';
import { GeolocationService } from 'src/app/service/geolocation.service';
import { SharedService } from 'src/app/shared/shared.service';
import { MapService } from 'src/app/service/map.service';
import { LoginService } from 'src/app/service/login.service';

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

  constructor(
    private cons: ConstantsService,
    private geolocationService: GeolocationService,
    private sharedService: SharedService,
    private mapService: MapService,
    private loginService: LoginService,
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
  }

  mapInitializer() {
    const coordinates: google.maps.LatLng = new google.maps.LatLng(this.coordinate.latitude, this.coordinate.longitude);
    const mapOptions: google.maps.MapOptions = {
      center: coordinates,
      zoom: 13,
      mapTypeControl: false,
    };
    this.map = new google.maps.Map(this.gmap.nativeElement, mapOptions);
    this.showMarks();
  }

  async showMarks() {
    const userId = this.loginService.getFirebaseUserData().uid;
    this.sharedService.setStatus(this.cons.SHAREDSTATUS.onloading, true);
    const dataList = await this.mapService.getMyMapList(userId);
    this.sharedService.setStatus(this.cons.SHAREDSTATUS.onloading, false);
    dataList.forEach((data) => {
      const marker = new google.maps.Marker({
        position: { lat: data.latitude, lng: data.longitude },
        map: this.map,
        icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        animation: google.maps.Animation.DROP,
      });
      this.markers.push(marker); // 統一管理 marker
    });
  }
}
