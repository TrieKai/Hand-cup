import { Injectable } from '@angular/core';

import { MenuConstantsService } from '../util/constants/menu-constants.service';
import { RouterConstantsService as routerCons } from '../util/constants/router-constants.service';
import { LoginComponent } from 'src/app/components/login/login.component';

const menuCons = new MenuConstantsService();
const home: Menu = { title: menuCons.HOME, router: routerCons.ROUTER_HOME, icon: menuCons.HOME_ICON };
const menus: Menu[] = [
  { title: menuCons.DRINK, router: routerCons.ROUTER_DRINK, icon: menuCons.DRINK_ICON },
  { title: menuCons.DRINK_SHOP, router: routerCons.ROUTER_DRINKSHOP, icon: menuCons.DRINK_SHOP_ICON },
  { title: menuCons.COMPARE, router: '', icon: menuCons.COMPARE_ICON },
  { title: menuCons.RECOMMENDATION, router: '', icon: menuCons.RECOMMENDATION_ICON },
  { title: menuCons.COLLECTION, router: '', icon: menuCons.COLLECTION_ICON },
  { title: menuCons.NEWEST, router: '', icon: menuCons.NEWEST_ICON },
];
const utilitiesMenus: Menu[] = [
  { title: menuCons.LOGIN_ICON, router: '', icon: menuCons.LOGIN_ICON, componentRef: LoginComponent },
  { title: menuCons.SETTING, router: '', icon: menuCons.SETTING_ICON },
  { title: menuCons.REPORT, router: '', icon: menuCons.REPORT_ICON },
];
@Injectable({
  providedIn: 'root'
})
export class MenuConfigService {

  constructor() { }

  getHome(): Menu {
    return home;
  }

  getMenu(): Menu[] {
    return menus;
  }

  getUtilitiesMenu(): Menu[] {
    return utilitiesMenus;
  }
}