import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';

import { ConstantsService } from 'src/app/util/constants/constants.service';
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

  constructor(
    private drinkShopService: DrinkShopService,
    private cons: ConstantsService,
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
    this.chosenShopDetail = await this.drinkShopService.getPlaceDetail(this.chosenShop.place_id);
    this.showChosenCard = true;
    this.showPreviewCard = false;
  }

  async previewCard(index: number) {
    this.showPreviewCard = true;
    this.showChosenCard = false;
    this.chosenShop = this.resultArray[index];
    this.chosenShopDetail = await this.drinkShopService.getPlaceDetail(this.chosenShop.place_id);
  }
}
