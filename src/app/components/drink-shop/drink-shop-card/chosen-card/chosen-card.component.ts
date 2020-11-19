import { Component, OnInit, HostListener, Input, Renderer2, Inject, ViewChild, ElementRef, SimpleChanges, OnChanges, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { ConstantsService } from 'src/app/util/constants/constants.service';
import { LocalstorageService } from 'src/app/util/localstorage.service';
import { CommonService } from 'src/app/service/common.service';
import { environment } from '../../../../../environments/environment';
import { DrinkShopService } from 'src/app/service/drink-shop.service';
import { FirebaseService } from 'src/app/service/firebase.service';
import { MessageService } from 'src/app/service/message.service';
import { DomService } from 'src/app/util/dom.service';

import { ReviewComponent } from '../review/review.component';

@Component({
  selector: 'app-chosen-card',
  templateUrl: './chosen-card.component.html',
  styleUrls: ['./chosen-card.component.scss']
})
export class ChosenCardComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() chosenShop: drinkShopResults;
  @ViewChild('dots', { static: false }) dotsRef: ElementRef<HTMLDivElement>;
  @ViewChild('dropdown', { static: false }) dropdownRef: ElementRef<HTMLDivElement>;
  isMobile: boolean = false;
  smallScreen: boolean = false;
  showDropDown: boolean;
  ratingStarWidth: number;
  ratingStarHeight: number;
  images: string[] = [];
  links: string[] = [];
  imageSliderStyles: object[] = [];
  listen: any;
  ratingText: number | string;
  componentKey: string;

  private _chosenShopDetail: drinkShopDetail;

  get chosenShopDetail(): drinkShopDetail {
    return this._chosenShopDetail;
  }

  @Input() set chosenShopDetail(data: drinkShopDetail) {
    this._chosenShopDetail = data;
    this.images = []; // Clear
    this.links = []; // Clear
    if (!data.photos) { return; }
    data.photos.map((photo) => {
      const photoUrl = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=' + photo.width + '&photoreference=' + photo.photo_reference + '&key=' + environment.photoAPIKey + '';
      this.images.push(photoUrl);
      this.links.push(photo.html_attributions[0]);
    });
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private cons: ConstantsService,
    private localStorageService: LocalstorageService,
    private common: CommonService,
    private drinkShopService: DrinkShopService,
    private firebase: FirebaseService,
    private renderer: Renderer2,
    private message: MessageService,
    private domService: DomService,
  ) { }

  @HostListener('window:resize', [])
  onResize() {
    // console.log('window_width:', window.innerWidth, 'window_height:', window.innerHeight)
    this.ratingStarWidth = 15;
    this.ratingStarHeight = 15;
    this.smallScreen = false;
    if (window.innerWidth >= 320 && window.innerWidth < 600) {
      this.ratingStarWidth = 10;
      this.ratingStarHeight = 10;
      this.smallScreen = true;
    } else if (window.innerWidth < 320) {
      this.ratingStarWidth = 10;
      this.ratingStarHeight = 10;
      this.smallScreen = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chosenShop.rating === 0) {
      this.ratingText = '尚未有評分'
    } else {
      this.ratingText = this.chosenShop.rating;
    }
  }

  ngOnInit() {
    this.isMobile = this.common.detectDeviceType().mobile;
    this.imageSliderStyles.push({ 'border-bottom-left-radius': '5px' });
    if (window.innerWidth < 600) { this.smallScreen = true; }
    this.componentKey = this.cons.SHAREDCOMPONENT.reviewComponentRef;
  }

  ngAfterViewInit() {
    this.onResize();
  }

  openDropDown(e: any) {
    e.preventDefault();
    this.showDropDown = true;
    this.listen = this.renderer.listen(this.document, 'click', (e: any) => {
      if (this.dotsRef.nativeElement.contains(e.target) || this.dropdownRef.nativeElement.contains(e.target)) { return; }
      this.showDropDown = false;
      this.listen();
    });
  }

  openUrl(url: string): void {
    window.open(url, '_blank');
  }

  openDialog(index: number): void {
    const componentRef = this.domService.createComponent(
      ReviewComponent,
      this.cons.SHAREDCOMPONENT.reviewComponentRef,
      { data: this.chosenShopDetail.reviews[index] }
    );
    this.domService.attachComponent(componentRef, this.document.body);
  }

  checkLocalStorage(placeId: string, type: string) {
    const value = this.localStorageService.getLocalStorage(placeId);
    if (value) {
      if (type === this.cons.LOCAL_STORAGE_TYPE.favorite) {
        return value.indexOf(this.cons.LOCAL_STORAGE_TYPE.favorite) > -1 ? true : false;
      } else if (type === this.cons.LOCAL_STORAGE_TYPE.visited) {
        return value.indexOf(this.cons.LOCAL_STORAGE_TYPE.visited) > -1 ? true : false;
      }
    } else { return null; }
  }

  async favoritetShop(placeId: string) {
    if (!this.checkLogin()) { return; }

    // Call API first
    const userData = this.firebase.getUserData();
    const respStatus = await this.drinkShopService.favoriteShop(true, placeId, userData.uid);
    if (!respStatus) { return; }

    const status = this.checkLocalStorage(placeId, this.cons.LOCAL_STORAGE_TYPE.favorite);
    if (status === false) {
      const valueStr = this.localStorageService.getLocalStorage(placeId) + this.cons.LOCAL_STORAGE_TYPE.favorite + ';';
      this.localStorageService.setLocalStorage(placeId, valueStr);
    } else if (status === null) {
      this.localStorageService.setLocalStorage(placeId, this.cons.LOCAL_STORAGE_TYPE.favorite + ';');
    } else { return; }
  }

  async unFavoriteShop(placeId: string) {
    if (!this.checkLogin()) { return; }

    // Call API first
    const userData = this.firebase.getUserData();
    const respStatus = await this.drinkShopService.favoriteShop(false, placeId, userData.uid);
    if (!respStatus) { return; }

    const value = this.localStorageService.getLocalStorage(placeId);
    if (value) {
      const valAry = value.split(';');
      const index = valAry.indexOf(this.cons.LOCAL_STORAGE_TYPE.favorite);
      if (index > -1) {
        valAry.splice(index, 1);
        if (valAry[0] !== '') {
          this.localStorageService.setLocalStorage(placeId, valAry[0] + ';');
        } else {
          this.localStorageService.removeLocalStorage(placeId);
        }
      }
    }
  }

  async visited(placeId: string) {
    if (!this.checkLogin()) { return; }

    // Call API first
    const userData = this.firebase.getUserData();
    const respStatus = await this.drinkShopService.visitedShop(true, placeId, userData.uid);
    if (!respStatus) { return; }

    const value = this.localStorageService.getLocalStorage(placeId);
    if (value && !this.checkLocalStorage(placeId, this.cons.LOCAL_STORAGE_TYPE.visited)) {
      const valueStr = this.localStorageService.getLocalStorage(placeId) + this.cons.LOCAL_STORAGE_TYPE.visited + ';';
      this.localStorageService.setLocalStorage(placeId, valueStr);
    } else if (!value) {
      this.localStorageService.setLocalStorage(placeId, this.cons.LOCAL_STORAGE_TYPE.visited + ';');
    }
  }

  async unVisited(placeId: string) {
    if (!this.checkLogin()) { return; }

    // Call API first
    const userData = this.firebase.getUserData();
    const respStatus = await this.drinkShopService.visitedShop(false, placeId, userData.uid);
    if (!respStatus) { return; }

    const value = this.localStorageService.getLocalStorage(placeId);
    if (value) {
      const valAry = value.split(';');
      const index = valAry.indexOf(this.cons.LOCAL_STORAGE_TYPE.visited);
      if (index > -1) {
        valAry.splice(index, 1);
        if (valAry[0] !== '') {
          this.localStorageService.setLocalStorage(placeId, valAry[0] + ';');
        } else {
          this.localStorageService.removeLocalStorage(placeId);
        }
      }
    }
  }

  checkLogin(): boolean {
    if (!this.firebase.checkAuthStatus()) {
      this.message.add({ type: this.cons.MESSAGE_TYPE.warn, title: '請先登入唷', content: '' });
      return false;
    } else {
      return true;
    }
  }
}
