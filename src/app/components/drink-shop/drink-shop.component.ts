import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ConstantsService } from 'src/app/util/constants/constants.service';
import { SharedService } from 'src/app/shared/shared.service';
import { DrinkShopService } from 'src/app/service/drink-shop.service';

@Component({
    selector: 'app-drink-shop',
    templateUrl: './drink-shop.component.html',
    styleUrls: ['./drink-shop.component.scss']
})
export class DrinkShopComponent implements OnInit, OnDestroy {
    onloading: boolean;
    showMap: boolean;
    subscribe: Subscription;
    infoMessage: string;

    constructor(
        private cons: ConstantsService,
        private sharedService: SharedService,
        private drinkShopService: DrinkShopService,
    ) {
        this.subscribe = this.sharedService.onInitEmitted.subscribe(() => {
            this.onloading = this.drinkShopService.getSharedData(this.cons.SHAREDDATA.onloading);
            this.showMap = this.drinkShopService.getSharedData(this.cons.SHAREDDATA.showMap);
        });
    }

    ngOnInit() {
        this.onloading = this.drinkShopService.getSharedData(this.cons.SHAREDDATA.onloading);
        this.showMap = this.drinkShopService.getSharedData(this.cons.SHAREDDATA.showMap);
        this.infoMessage = this.cons.INFO_MESSAGE.drinkShops;
    }

    ngOnDestroy() {
        if (this.subscribe) {
            this.subscribe.unsubscribe();
        }
    }
}
