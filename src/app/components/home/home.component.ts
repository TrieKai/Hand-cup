import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RouterConstantsService as routerCons } from 'src/app/util/constants/router-constants.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(
        private router: Router,
    ) { }

    ngOnInit() {
    }

    navigateByUrl(url: string) {
        switch (url) {
            case routerCons.ROUTER_MAP:
                this.router.navigateByUrl("/" + routerCons.ROUTER_MAP);
                break;
            case routerCons.ROUTER_DRINK:
                this.router.navigateByUrl("/" + routerCons.ROUTER_DRINK);
                break;
        }
    }
}
