import { Component, OnInit, isDevMode, OnDestroy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ConstantsService } from 'src/app/util/constants/constants.service';
import { SharedService } from 'src/app/shared/shared.service';
import { DrinkShopService } from 'src/app/service/drink-shop.service';
import { MessageService } from 'src/app/service/message.service';
import { GlobalService as global } from '../../../service/global.service';
import { RouterConstantsService as routerCons } from '../../../util/constants/router-constants.service';

@Component({
  selector: 'app-drink-shop-card',
  templateUrl: './drink-shop-card.component.html',
  styleUrls: ['./drink-shop-card.component.scss']
})
export class DrinkShopCardComponent implements OnInit, OnDestroy, OnChanges {
  @Input() filterMode: boolean;
  @Output() filterModeChange = new EventEmitter<boolean>();
  results: drinkShopResults[] = []; // 取前五
  allResults: drinkShopResults[] = []; // 全部的結果
  chosenShop: drinkShopResults;
  chosenShopDetail: drinkShopDetail;
  showChosenCard: boolean = false;
  showPreviewCard: boolean = false;
  drinkShopResultsBS: BehaviorSubject<any>;
  drinkLink: string = '/' + routerCons.ROUTER_DRINK;

  constructor(
    private cons: ConstantsService,
    private sharedService: SharedService,
    private drinkShopService: DrinkShopService,
    private messageService: MessageService,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    this.filterMode = changes.filterMode.currentValue;
  }

  ngOnInit() {
    this.drinkShopResultsBS = this.sharedService.getSharedData(this.cons.SHAREDDATA.drinkShopResults);
    this.drinkShopResultsBS.subscribe((drinkShopResults: drinkShopResults[]) => {
      if (drinkShopResults) {
        this.results = drinkShopResults.slice(0, 5);
        this.allResults = drinkShopResults;
      }
    });
    if (isDevMode() || global.showLog) {
      console.log(this.results);
    }
  }

  ngOnDestroy(): void {
    if (this.drinkShopResultsBS) {
      this.sharedService.deleteSharedData(this.cons.SHAREDDATA.drinkShopResults);
      this.drinkShopResultsBS.unsubscribe();
    }
  }

  handleTransformScenes(status: string): void {
    if (status === 'map') {
      this.sharedService.setStatus(this.cons.SHAREDSTATUS.showMap, true);
    } else if (status === 'cards') {
      this.showPreviewCard = false;
      this.showChosenCard = false;
    } else { return; }
  }

  async handleDraw(): Promise<void> {
    if (this.results.length === 0) {
      this.messageService.add({ type: this.cons.MESSAGE_TYPE.info, title: '恭喜恭喜，喝水囉!', content: '' });
      return;
    }
    this.filterModeChange.emit(false); // switch to normal mode
    const randomIndex = Math.floor(Math.random() * Math.floor(this.results.length));
    this.chosenShop = this.results[randomIndex];
    this.sharedService.setStatus(this.cons.SHAREDSTATUS.onloading, true);
    this.chosenShopDetail = await this.drinkShopService.getPlaceDetail(this.chosenShop.place_id);
    this.sharedService.setStatus(this.cons.SHAREDSTATUS.onloading, false);
    this.showChosenCard = true;
    this.showPreviewCard = false;
  }

  async previewCard(index: number) {
    if (this.filterMode) { return; }
    this.chosenShop = this.results[index];
    this.sharedService.setStatus(this.cons.SHAREDSTATUS.onloading, true);
    this.chosenShopDetail = await this.drinkShopService.getPlaceDetail(this.chosenShop.place_id);
    this.sharedService.setStatus(this.cons.SHAREDSTATUS.onloading, false);
    this.showPreviewCard = true;
    this.showChosenCard = false;
  }

  removeShop(index: number) {
    if (this.allResults.length < 2) {
      this.messageService.add({ type: this.cons.MESSAGE_TYPE.info, title: '恭喜恭喜，喝水囉!', content: '' });
    }
    this.allResults.splice(index, 1); // remove element by index
    this.results = this.allResults.slice(0, 5);
  }
}
