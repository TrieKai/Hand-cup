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
  windowWidth: any;
  windowHeight: any;

  constructor(
    private drinkShopService: DrinkShopService,
    private cons: ConstantsService,
    private dialog: MatDialog,
  ) { }

  @HostListener('window:resize', [])
  onResize() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    console.log('window_width:', this.windowWidth, 'window_height:', this.windowHeight)
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
      maxWidth: this.handleWidth()[0],
      minWidth: this.handleWidth()[1],
      maxHeight: this.windowHeight * 0.8,
      data: { review: this.chosenShopDetail.reviews[index] }
    });
  }

  handleWidth(): number[] {
    if (this.windowWidth >= 1280) {
      return [800, 500];
    } else if (this.windowWidth >= 800 && this.windowWidth < 1280) {
      return [500, 350];
    } else if (this.windowWidth >= 320 && this.windowWidth < 550) {
      return [300, 250];
    } else {
      return [this.windowWidth * 0.9, this.windowWidth * 0.8];
    }
  }
}
