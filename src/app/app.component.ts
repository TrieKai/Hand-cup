import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import { GlobalService as global } from 'src/app/service/global.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    onloading: boolean;
    onloadingSB: BehaviorSubject<boolean>;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private sharedService: SharedService,
        private cons: ConstantsService,
    ) {
        this.onloadingSB = this.sharedService.setStatus(this.cons.SHAREDSTATUS.onloading, false);
        this.onloadingSB.subscribe((status) => {
            this.onloading = status;
        });
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            (window as any).showLog = (show: boolean) => { global.showLog = show; };

            window.addEventListener('install', (event) => {
                console.log('install', event);
            });
        }
    }
}
