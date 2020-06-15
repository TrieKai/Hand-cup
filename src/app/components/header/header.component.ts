import { Component, OnInit } from '@angular/core';

import { RouterConfigService } from 'src/app/config/router-config.service';
import { MenuConfigService } from 'src/app/config/menu-config.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
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
