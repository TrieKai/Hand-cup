import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ConstantsService } from 'src/app/util/constants/constants.service';
import { DrinkShopService } from 'src/app/service/drink-shop.service';
import { DialogComponent } from 'src/app/components/common/dialog/dialog.component';

@Component({
  selector: 'app-drink-shop-card',
  templateUrl: './drink-shop-card.component.html',
  styleUrls: ['./drink-shop-card.component.scss']
})
export class DrinkShopCardComponent implements OnInit, AfterViewInit {
  @ViewChild('cardContainer', { static: false }) cardContainer: ElementRef;
  resultArray: drinkShopResults[] = [];
  chosenShop: drinkShopResults;
  chosenShopDetail: drinkShopDetail;
  showChosenCard: boolean = false;
  dialogMaxWidth: number;
  dialogMinWidth: number;
  dialogMaxHeight: number;
  ratingStarWidth: number;
  ratingStarHeight: number;

  constructor(
    private drinkShopService: DrinkShopService,
    private cons: ConstantsService,
    private dialog: MatDialog,
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
    this.resultArray = this.drinkShopService.getSharedData(this.cons.SHAREDDATA.drinkShopResults);
    console.log(this.resultArray)
  }

  ngAfterViewInit() {
    this.onResize();
  }

  handleTransformScenes(status: string): void {
    if (status === 'map') {
      this.drinkShopService.setSharedData(this.cons.SHAREDDATA.showMap, true);
    } else if (status === 'cards') {
      this.showChosenCard = false;
    } else { return; }
  }

  async handleDraw(): Promise<void> {
    const randomIndex = Math.floor(Math.random() * Math.floor(this.resultArray.length));
    this.chosenShop = this.resultArray[randomIndex];
    this.chosenShopDetail = await this.drinkShopService.getPlaceDetail(this.chosenShop.place_id);
    this.showChosenCard = true;
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
}
