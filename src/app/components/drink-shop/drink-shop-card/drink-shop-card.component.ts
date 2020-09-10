import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';

import { ConstantsService } from 'src/app/util/constants/constants.service';
import { SharedService } from 'src/app/shared/shared.service';
import { DrinkShopService } from 'src/app/service/drink-shop.service';

@Component({
  selector: 'app-drink-shop-card',
  templateUrl: './drink-shop-card.component.html',
  styleUrls: ['./drink-shop-card.component.scss']
})
export class DrinkShopCardComponent implements OnInit {
  @ViewChild('cardContainer', { static: false }) cardContainer: ElementRef;
  resultArray: drinkShopResults[] = [];
  chosenShop: drinkShopResults;
  chosenShopDetail: drinkShopDetail;
  showChosenCard: boolean = false;
  showPreviewCard: boolean = false;
  onloading: boolean;

  constructor(
    private cons: ConstantsService,
    private sharedService: SharedService,
    private drinkShopService: DrinkShopService,
  ) { }

  ngOnInit() {
    this.resultArray = this.drinkShopService.getSharedData(this.cons.SHAREDDATA.drinkShopResults);
    console.log(this.resultArray)
  }

  handleTransformScenes(status: string): void {
    if (status === 'map') {
      this.drinkShopService.setSharedData(this.cons.SHAREDDATA.showMap, true);
    } else if (status === 'cards') {
      this.showPreviewCard = false;
      this.showChosenCard = false;
    } else { return; }
  }

  async handleDraw(): Promise<void> {
    const randomIndex = Math.floor(Math.random() * Math.floor(this.resultArray.length));
    this.chosenShop = this.resultArray[randomIndex];
    this.sharedService.setSharedData(this.cons.SHAREDDATA.onloading, true);
    this.chosenShopDetail = await this.drinkShopService.getPlaceDetail(this.chosenShop.place_id);
    this.sharedService.setSharedData(this.cons.SHAREDDATA.onloading, false);
    this.showChosenCard = true;
    this.showPreviewCard = false;
  }

  async previewCard(index: number) {
    this.chosenShop = this.resultArray[index];
    this.sharedService.setSharedData(this.cons.SHAREDDATA.onloading, true);
    this.chosenShopDetail = await this.drinkShopService.getPlaceDetail(this.chosenShop.place_id);
    this.sharedService.setSharedData(this.cons.SHAREDDATA.onloading, false);
    this.showPreviewCard = true;
    this.showChosenCard = false;
  }
}
