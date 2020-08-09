import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ConstantsService } from 'src/app/util/constants/constants.service';
import { DrinkShopService } from 'src/app/service/drink-shop.service';
import { DialogComponent } from 'src/app/components/common/dialog/dialog.component';

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
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.resultArray = this.drinkShopService.getSharedData(this.cons.SHAREDDATA.drinkShopResults);
    console.log(this.resultArray)
  }

  handleTransformScenes(status: string): void {
    if (status === 'map') {
      this.drinkShopService.setSharedData(this.cons.SHAREDDATA.showMap, true);
    } else if (status === 'cards') {
      this.showChosenCard = false;
    } else { return; }
  }

  handleDraw(): void {
    const randomIndex = Math.floor(Math.random() * Math.floor(this.resultArray.length));
    this.chosenShop = this.resultArray[randomIndex];
    this.showChosenCard = true;
  }

  openUrl(url: string): void {
    window.open(url, '_blank');
  }

  openDialog(index: number): void {
    this.dialog.open(DialogComponent, {
      maxWidth: 500,
      minWidth: 300,
      data: { reviews: this.chosenShop.reviews[index] }
    });
  }
}
