import { Component, OnInit } from '@angular/core';

import { RouterConfigService } from './config/router-config.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    menus: Menu[] = [
        { name: "今天飲料喝什麼?", icon: "folder", },
        { name: "今天飲料喝哪家?", icon: "folder", },
        { name: "比較樣式", icon: "folder", },
        { name: "客製化推薦", icon: "folder", },
        { name: "我的收藏", icon: "folder", },
        { name: "What's new!", icon: "folder", }
    ];
    utilitiesMenus: UtilitiesMenu[] = [
        { name: "登出", icon: "apps" },
        { name: "設定", icon: "apps" },
        { name: "回報區", icon: "apps" },
    ];

    constructor(
        private routerCfg: RouterConfigService,
    ) { }

    ngOnInit(): void {
        this.routerCfg.setRoutes();
    }
}
