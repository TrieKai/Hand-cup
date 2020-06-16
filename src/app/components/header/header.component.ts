import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { RouterConfigService } from 'src/app/config/router-config.service';
import { MenuConfigService } from 'src/app/config/menu-config.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    @ViewChild('searchInput', { static: false }) searchInput: ElementRef
    home: Menu;
    menuList: Menu[] = [];
    utilitiesMenuList: Menu[] = [];

    constructor(
        private routerCfg: RouterConfigService,
        private menuCfg: MenuConfigService,
        protected sharedService: SharedService,
    ) { }

    ngOnInit(): void {
        this.routerCfg.setRoutes();
        this.menuList = this.menuCfg.getMenu();
        this.utilitiesMenuList = this.menuCfg.getUtilitiesMenu();
        this.home = this.menuCfg.getHome();
    }

    ngAfterViewInit(): void {
        console.log(this.searchInput)
        this.sharedService.set('searchInput', this.searchInput.nativeElement);
    }

    ngOnDestroy(): void {
        this.sharedService.delete('searchInput');
    }
}
