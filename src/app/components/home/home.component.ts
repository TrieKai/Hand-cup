import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { GeolocationService } from 'src/app/service/geolocation.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { DomService } from 'src/app/util/dom.service';

import { TourComponent } from '../../components/common/tour/tour.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  map: google.maps.Map;
  coordinate: Coordinate = { latitude: null, longitude: null };
  coordinates: google.maps.LatLng;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private geolocationService: GeolocationService,
    private domService: DomService,
    private cons: ConstantsService,
  ) { }

  ngOnInit() {
    this.geolocationService.getPosition().then(pos => {
      console.log(`Positon: ${pos.lng} ${pos.lat}`);
      this.coordinate.longitude = pos.lng;
      this.coordinate.latitude = pos.lat;
      this.mapInitializer();
    });

    const componentRef = this.domService.createComponent(
      TourComponent,
      this.cons.SHAREDCOMPONENT.tourComponentRef,
      {
        data: [
          { step: 1, target: document.querySelector('#hamburger'), title: '選單', content: '點擊選單後可以切換功能' }
        ]
      }
    );
    this.domService.attachComponent(componentRef, this.document.body);
  }

  mapInitializer() {
    this.coordinates = new google.maps.LatLng(this.coordinate.latitude, this.coordinate.longitude);
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
}
