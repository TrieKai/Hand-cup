import { Component, OnInit, HostListener, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ConstantsService } from 'src/app/util/constants/constants.service';
import { DialogComponent } from 'src/app/components/common/dialog/dialog.component';
import { LocalstorageService } from 'src/app/util/localstorage.service';
import { CommonService } from 'src/app/service/common.service';
import { environment } from 'src/environments/environment';
import { DrinkShopService } from 'src/app/service/drink-shop.service';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-chosen-card',
  templateUrl: './chosen-card.component.html',
  styleUrls: ['./chosen-card.component.scss']
})
export class ChosenCardComponent implements OnInit {
  @Input() chosenShop: drinkShopResults;
  isMobile: boolean;
  // showDropDown: boolean;
  dialogMaxWidth: number;
  dialogMinWidth: number;
  dialogMaxHeight: number;
  ratingStarWidth: number;
  ratingStarHeight: number;
  beenThere: boolean;
  images: string[] = [];
  links: string[] = [];
  imageSliderStyles: object[] = [];

  private _chosenShopDetail: drinkShopDetail;

  get chosenShopDetail(): drinkShopDetail {
    return this._chosenShopDetail;
  }

  @Input() set chosenShopDetail(data: drinkShopDetail) {
    this._chosenShopDetail = data;
    this.images = []; // Clear
    this.links = []; // Clear
    data.photos.map((photo) => {
      const photoUrl = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=' + photo.width + '&photoreference=' + photo.photo_reference + '&key=' + environment.photoAPIKey + '';
      this.images.push(photoUrl);
      this.links.push(photo.html_attributions[0]);
    });
  }

  constructor(
    private cons: ConstantsService,
    private dialog: MatDialog,
    private localStorageService: LocalstorageService,
    private common: CommonService,
    private drinkShopService: DrinkShopService,
    private firebase: FirebaseService,
  ) { }

  @HostListener('window:resize', [])
  onResize() {
    console.log('window_width:', window.innerWidth, 'window_height:', window.innerHeight)
    this.dialogMaxHeight = window.innerHeight * 0.8;
    this.ratingStarWidth = 15;
    this.ratingStarHeight = 15;
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
    } else if (window.innerWidth < 320) {
      this.dialogMaxWidth = window.innerWidth * 0.9;
      this.dialogMinWidth = window.innerWidth * 0.8;
      this.ratingStarWidth = 10;
      this.ratingStarHeight = 10;
    }
  }

  ngOnInit() {
    this.isMobile = this.common.detectMobile();
    this.imageSliderStyles.push({ 'border-bottom-left-radius': '5px' });
  }

  ngAfterViewInit() {
    this.onResize();
  }

  // openDropDown() {
  //   this.showDropDown = true;
  // }

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
    const value = this.localStorageService.getLocalStorage(placeId);
    if (value && !this.checkLocalStorage(placeId, this.cons.LOCAL_STORAGE_TYPE.visited)) {
      const valueStr = this.localStorageService.getLocalStorage(placeId) + this.cons.LOCAL_STORAGE_TYPE.visited + ';';
      this.localStorageService.setLocalStorage(placeId, valueStr);
    } else if (!value) {
      this.localStorageService.setLocalStorage(placeId, this.cons.LOCAL_STORAGE_TYPE.visited + ';');
    }
    this.beenThere = true;
  }

  unVisited(placeId: string) {
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
    this.beenThere = false;
  }
}
