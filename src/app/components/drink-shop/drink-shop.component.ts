import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ConstantsService } from 'src/app/util/constants/constants.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
    selector: 'app-drink-shop',
    templateUrl: './drink-shop.component.html',
    styleUrls: ['./drink-shop.component.scss']
})
export class DrinkShopComponent implements OnInit, OnDestroy {
    showMap: boolean;
    showMapSB: BehaviorSubject<boolean>;
    infoMessage: string;

    constructor(
        private cons: ConstantsService,
        private sharedService: SharedService,
    ) { }

    ngOnInit() {
        this.infoMessage = this.cons.INFO_MESSAGE.drinkShops;
        this.showMapSB = this.sharedService.setStatus(this.cons.SHAREDSTATUS.showMap, true);
        this.showMapSB.subscribe((status) => {
            this.showMap = status;
        });
    }

    ngOnDestroy() {
        if (this.showMapSB) {
            this.showMapSB.unsubscribe();
        }
    }
}
