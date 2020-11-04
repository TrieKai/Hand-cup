import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
        private sharedService: SharedService,
        private cons: ConstantsService
    ) {
        // this.subscribe = this.sharedService.onInitEmitted.subscribe(() => {
        //     this.onloading = sharedService.getSharedData(cons.SHAREDDATA.onloading);
        // });
        this.onloadingSB = this.sharedService.getStatus(this.cons.SHAREDSTATUS.onloading);
        this.onloadingSB.subscribe((status) => {
            this.onloading = status;
        });
    }

    ngOnInit() {
        // this.onloading = this.sharedService.getSharedData(this.cons.SHAREDDATA.onloading);
    }
}
