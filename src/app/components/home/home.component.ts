import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { ConstantsService } from 'src/app/util/constants/constants.service';
import { DomService } from 'src/app/util/dom.service';
import { LocalstorageService } from 'src/app/util/localstorage.service';
import { RouterConstantsService as routerCons } from '../../util/constants/router-constants.service';

import { ConfirmComponent } from '../../components/common/confirm/confirm.component';
import { TourComponent } from '../../components/common/tour/tour.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  map: google.maps.Map;
  coordinate: Coordinate = { latitude: null, longitude: null };
  drinkshopLink = '/' + routerCons.ROUTER_DRINKSHOP;
  drinkLink = '/' + routerCons.ROUTER_DRINK;
  mymapLink = '/' + routerCons.ROUTER_MYMAP;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private domService: DomService,
    private cons: ConstantsService,
    private localStorageService: LocalstorageService,
  ) { }

  ngOnInit() {
    this.handleTour();
  }

  handleTour() {
    if (this.localStorageService.getLocalStorage(this.cons.LOCAL_STORAGE_TYPE.tour) === null) {
      setTimeout(() => {
        const componentRef = this.domService.createComponent(
          ConfirmComponent,
          this.cons.SHAREDCOMPONENT.confirmComponentRef,
          { title: '', message: '需要導覽介紹嗎?' }
        );
        this.domService.attachComponent(componentRef, this.document.body);
        componentRef.instance.callback
          .toPromise()
          .then((status: boolean) => {
            if (status) {
              const componentRef = this.domService.createComponent(
                TourComponent,
                this.cons.SHAREDCOMPONENT.tourComponentRef,
                {
                  data: [
                    { step: 1, target: document.querySelector('#hamburger'), title: '選單', content: '點擊選單後可以切換功能', timeout: 250 },
                    { step: 2, target: document.querySelectorAll('.menu-span')[0], title: '選單功能介紹', content: '「今天飲料喝哪家?」 可以隨機為你選出離你最近的五家飲料店', timeout: 0 },
                    { step: 3, target: document.querySelectorAll('.menu-span')[1], title: '選單功能介紹', content: '「今天飲料喝甚麼?」 可以隨機為你選出飲料品項', timeout: 0 },
                    { step: 4, target: document.querySelectorAll('.menu-span')[2], title: '選單功能介紹', content: '「我的地圖」 可以找到你曾經收藏的飲料店', timeout: 0 },
                    { step: 5, target: document.querySelector('.account-button'), title: '登入與設定', content: '點擊選單後可以進行登入', timeout: 0, position: { top: 70, right: 40 } },
                  ]
                }
              );
              this.domService.attachComponent(componentRef, this.document.body);
            } else {
              this.localStorageService.setLocalStorage(this.cons.LOCAL_STORAGE_TYPE.tour, this.cons.STATUS.false);
            }
          });
      }, 2000);
    }
  }
}
