import { Injectable } from '@angular/core';

import { MenuConstantsService } from '../util/constants/menu-constants.service';
import { RouterConstantsService as routerCons } from '../util/constants/router-constants.service';

const menuCons = new MenuConstantsService();
const menus: Menu[] = [
  { title: menuCons.DRINK, router: routerCons.ROUTER_DRINK, icon: menuCons.DRINK_ICON },
  { title: menuCons.DRINK_SHOP, router: routerCons.ROUTER_DRINKSHOP, icon: menuCons.DRINK_SHOP_ICON },
  { title: menuCons.COMPARE, router: '', icon: menuCons.COMPARE_ICON },
  { title: menuCons.RECOMMENDATION, router: '', icon: menuCons.RECOMMENDATION_ICON },
  { title: menuCons.COLLECTION, router: '', icon: menuCons.COLLECTION_ICON },
  { title: menuCons.NEWEST, router: '', icon: menuCons.NEWEST_ICON },
];
@Injectable({
  providedIn: 'root'
})
export class MenuConfigService {

  constructor() { }

  getMenu(): Menu[] {
    return menus;
  }
}