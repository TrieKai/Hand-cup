import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input } from '@angular/core';

import { ConstantsService } from 'src/app/util/constants/constants.service';
import { DrinkShopService } from 'src/app/service/drink-shop.service';
import { HtmlElementService } from 'src/app/shared/html-element.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
    selector: 'app-drink-shop-card',
    templateUrl: './drink-shop-card.component.html',
    styleUrls: ['./drink-shop-card.component.scss']
})
export class DrinkShopCardComponent implements OnInit {
    resultArray: drinkShopResults[] = [];
    @ViewChild('cardContainer', { static: false }) cardContainer: ElementRef;

    constructor(
        private drinkShopService: DrinkShopService,
        private cons: ConstantsService,
        private htmlElementService: HtmlElementService,
        private renderer: Renderer2,
        private sharedService: SharedService,
    ) { }

    ngOnInit() {
        this.resultArray = this.drinkShopService.getSharedData(this.cons.SHAREDDATA_DRINKSHOPRESULTS);
        console.log(this.resultArray)
    }

    handleTransformScenes() {
        this.drinkShopService.setSharedData(this.cons.SHAREDDATA_SHOWMAP, true);
    }
}