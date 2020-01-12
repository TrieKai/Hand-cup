import { Component, OnInit } from '@angular/core';

import { RouterConfigService } from './config/router-config.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    constructor(
        private routerCfg: RouterConfigService,
    ) { }

    ngOnInit(): void {
        this.routerCfg.setRoutes();
    }
}
