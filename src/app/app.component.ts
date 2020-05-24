import { Component, OnInit } from '@angular/core';

import { RouterConfigService } from './config/router-config.service';
import { MenuConfigService } from './config/menu-config.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    home: Menu;
    menuList: Menu[] = [];
    utilitiesMenuList: Menu[] = [];

    constructor(
        private routerCfg: RouterConfigService,
        private menuCfg: MenuConfigService,
    ) { }

    ngOnInit(): void {
        this.routerCfg.setRoutes();
        this.menuList = this.menuCfg.getMenu();
        this.utilitiesMenuList = this.menuCfg.getUtilitiesMenu();
        this.home = this.menuCfg.getHome();
    }
}
