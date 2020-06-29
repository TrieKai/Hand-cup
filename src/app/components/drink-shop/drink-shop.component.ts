import { Component, OnInit } from '@angular/core';

import { ConstantsService } from 'src/app/util/constants/constants.service';
import { SharedService } from 'src/app/shared/shared.service';
import { DrinkShopService } from 'src/app/service/drink-shop.service';
import { Subscribable, Subscription } from 'rxjs';

@Component({
    selector: 'app-drink-shop',
    templateUrl: './drink-shop.component.html',
    styleUrls: ['./drink-shop.component.scss']
})
export class DrinkShopComponent implements OnInit {
    onloading: boolean;
    showMap: boolean;
    subscription: Subscription

    constructor(
        private cons: ConstantsService,
        private sharedService: SharedService,
        private drinkShopService: DrinkShopService,
    ) {
        this.subscription = this.sharedService.onInitEmitted.subscribe(() => {
            console.log('subscribe!')
            this.onloading = drinkShopService.getSharedData(cons.SHAREDDATA_ONLOADING);
            console.log('aaa', this.onloading)
            this.showMap = this.drinkShopService.getSharedData(cons.SHAREDDATA_SHOWMAP);
        });
    }

    ngOnInit() {
        this.onloading = this.drinkShopService.getSharedData(this.cons.SHAREDDATA_ONLOADING);
        this.showMap = this.drinkShopService.getSharedData(this.cons.SHAREDDATA_SHOWMAP);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
