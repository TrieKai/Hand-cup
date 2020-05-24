import { Injectable } from '@angular/core';
import { Router, Route } from '@angular/router';

import { RouterConstantsService as routerCons } from '../util/constants/router-constants.service';

import { HomeComponent } from 'src/app/components/home/home.component';
import { MapComponent } from 'src/app/components/map/map.component';
import { DrinkComponent } from 'src/app/components/drink/drink.component';
import { DrinkShopComponent } from 'src/app/components/drink-shop/drink-shop.component';

const routes = [
    { path: routerCons.ROUTER_MAP, component: MapComponent },
    { path: routerCons.ROUTER_DRINK, component: DrinkComponent },
    { path: routerCons.ROUTER_DRINKSHOP, component: DrinkShopComponent },
];

@Injectable({
    providedIn: 'root'
})
export class RouterConfigService {
    // common routes
    private readonly common: Route[] = [
        { path: '', redirectTo: routerCons.ROUTER_HOME, pathMatch: 'full' },
        { path: routerCons.ROUTER_HOME, component: HomeComponent },
    ];

    constructor(
        private router: Router,
    ) { }

    setRoutes(): void {
        const items: Route[] = this.common;
        routes.forEach((route) => {
            items.push(route);
        });
        items.push({ path: '**', redirectTo: routerCons.ROUTER_HOME });

        this.router.resetConfig(items);
        console.log('setRoutes', items)
    }
}
