import { Component, OnInit, HostListener, Input, Renderer2, Inject, ViewChild, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { ConstantsService } from 'src/app/util/constants/constants.service';
import { LocalstorageService } from 'src/app/util/localstorage.service';
import { CommonService } from 'src/app/service/common.service';
import { environment } from '../../../../../environments/environment';
import { DrinkShopService } from 'src/app/service/drink-shop.service';
import { FirebaseService } from 'src/app/service/firebase.service';
import { MessageService } from 'src/app/service/message.service';

import { DialogComponent } from '../../../common/dialog/dialog.component';

@Component({
  selector: 'app-chosen-card',
  templateUrl: './chosen-card.component.html',
  styleUrls: ['./chosen-card.component.scss']
})
export class ChosenCardComponent implements OnInit {
  @Input() chosenShop: drinkShopResults;
  @ViewChild('dots', { static: false }) dotsRef: ElementRef<HTMLDivElement>;
  @ViewChild('dropdown', { static: false }) dropdownRef: ElementRef<HTMLDivElement>;
  isMobile: boolean;
  smallScreen: boolean;
  showDropDown: boolean;
  dialogMaxWidth: number;
  dialogMinWidth: number;
  dialogMaxHeight: number;
  ratingStarWidth: number;
  ratingStarHeight: number;
  images: string[] = [];
  links: string[] = [];
  imageSliderStyles: object[] = [];
  listen: any;

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
    private dialog: MatDialog,
    private localStorageService: LocalstorageService,
    private common: CommonService,
    private drinkShopService: DrinkShopService,
    private firebase: FirebaseService,
    private renderer: Renderer2,
    private message: MessageService,
  ) { }

  @HostListener('window:resize', [])
  onResize() {
    // console.log('window_width:', window.innerWidth, 'window_height:', window.innerHeight)
    this.dialogMaxHeight = window.innerHeight * 0.8;
    this.ratingStarWidth = 15;
    this.ratingStarHeight = 15;
    this.smallScreen = false;
    if (window.innerWidth >= 1280) {
      this.dialogMaxWidth = 800;
      this.dialogMinWidth = 500;
    } else if (window.innerWidth >= 800 && window.innerWidth < 1280) {
      this.dialogMaxWidth = 500;
      this.dialogMinWidth = 350;
    } else if (window.innerWidth >= 320 && window.innerWidth < 600) {
      this.dialogMaxWidth = 300;
      this.dialogMinWidth = 250;
      this.ratingStarWidth = 10;
      this.ratingStarHeight = 10;
      this.smallScreen = true;
    } else if (window.innerWidth < 320) {
      this.dialogMaxWidth = window.innerWidth * 0.9;
      this.dialogMinWidth = window.innerWidth * 0.8;
      this.ratingStarWidth = 10;
      this.ratingStarHeight = 10;
      this.smallScreen = true;
    }
  }

  ngOnInit() {
    this.isMobile = this.common.detectDeviceType().mobile;
    this.imageSliderStyles.push({ 'border-bottom-left-radius': '5px' });
    if (window.innerWidth < 600) { this.smallScreen = true; }
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
    this.dialog.open(DialogComponent, {
      maxWidth: this.dialogMaxWidth,
      minWidth: this.dialogMinWidth,
      maxHeight: this.dialogMaxHeight,
      data: { review: this.chosenShopDetail.reviews[index] }
    });
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

    const status = this.checkLocalStorage(placeId, this.cons.LOCAL_STORAGE_TYPE.favorite);
    if (status === false) {
      const valueStr = this.localStorageService.getLocalStorage(placeId) + this.cons.LOCAL_STORAGE_TYPE.favorite + ';';
      this.localStorageService.setLocalStorage(placeId, valueStr);
    } else if (status === null) {
      this.localStorageService.setLocalStorage(placeId, this.cons.LOCAL_STORAGE_TYPE.favorite + ';');
    } else { return; }

    const userData = this.firebase.getUserData();
    await this.drinkShopService.favoriteShop(true, placeId, userData.uid);
  }

  async unFavoriteShop(placeId: string) {
    if (!this.checkLogin()) { return; }

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

        const userData = this.firebase.getUserData();
        await this.drinkShopService.favoriteShop(false, placeId, userData.uid);
      }
    }
  }

  visited(placeId: string) {
    if (!this.checkLogin()) { return; }

    const value = this.localStorageService.getLocalStorage(placeId);
    if (value && !this.checkLocalStorage(placeId, this.cons.LOCAL_STORAGE_TYPE.visited)) {
      const valueStr = this.localStorageService.getLocalStorage(placeId) + this.cons.LOCAL_STORAGE_TYPE.visited + ';';
      this.localStorageService.setLocalStorage(placeId, valueStr);
    } else if (!value) {
      this.localStorageService.setLocalStorage(placeId, this.cons.LOCAL_STORAGE_TYPE.visited + ';');
    }
  }

  unVisited(placeId: string) {
    if (!this.checkLogin()) { return; }

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
      } else {
        this.localStorageService.removeLocalStorage(placeId);
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
