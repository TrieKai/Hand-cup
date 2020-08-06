import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

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
  showChosenCard: boolean = false;

  constructor(
    private drinkShopService: DrinkShopService,
    private cons: ConstantsService,
  ) { }

  ngOnInit() {
    this.resultArray = this.drinkShopService.getSharedData(this.cons.SHAREDDATA.drinkShopResults);
    console.log(this.resultArray)
  }

  handleTransformScenes(status: string) {
    if (status === 'map') {
      this.drinkShopService.setSharedData(this.cons.SHAREDDATA.showMap, true);
    } else if (status === 'cards') {
      console.log('ggg')
      this.showChosenCard = false;
    } else { return; }
  }

  handleDraw() {
    const randomIndex = Math.floor(Math.random() * Math.floor(this.resultArray.length));
    this.chosenShop = this.resultArray[randomIndex];
    this.showChosenCard = true;
  }
}
