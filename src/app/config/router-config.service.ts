import { Injectable } from '@angular/core';
import { Router, Route } from '@angular/router';

import { RouterConstantsService as routerCons } from '../util/constants/router-constants.service';

import { HomeComponent } from 'src/app/components/home/home.component';
import { DrinkComponent } from 'src/app/components/drink/drink.component';
import { DrinkShopComponent } from 'src/app/components/drink-shop/drink-shop.component';
import { MyMapComponent } from 'src/app/components/my-map/my-map.component';
// import { AuthEmailComponent } from 'src/app/components/login/auth-email/auth-email.component';

const routes = [
    { path: routerCons.ROUTER_DRINK, component: DrinkComponent },
    { path: routerCons.ROUTER_DRINKSHOP, component: DrinkShopComponent },
    { path: routerCons.ROUTER_MYMAP, component: MyMapComponent },
    // { path: routerCons.ROUTER_AUTHEMAIL, component: AuthEmailComponent }, // TODO: Fix email verify
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
    }
}
