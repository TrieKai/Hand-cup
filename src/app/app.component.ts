import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { RouterConfigService } from './config/router-config.service';
import { MenuConfigService } from './config/menu-config.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @Output() onSelect = new EventEmitter();
    menuList = [];
    utilitiesMenus: UtilitiesMenu[] = [
        { name: "登出", icon: "apps" },
        { name: "設定", icon: "apps" },
        { name: "回報區", icon: "apps" },
    ];

    constructor(
        private routerCfg: RouterConfigService,
        private menuCfg: MenuConfigService,
    ) { }

    ngOnInit(): void {
        this.routerCfg.setRoutes();
        this.menuList = this.menuCfg.getMenu();
    }
}
