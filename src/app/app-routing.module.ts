import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RouterConstantsService as routerCons } from './util/constants/router-constants.service';

import { HomeComponent } from './components/home/home.component';
import { DrinkComponent } from './components/drink/drink.component';
import { DrinkShopComponent } from './components/drink-shop/drink-shop.component';
import { AuthEmailComponent } from './components/login/auth-email/auth-email.component';

const routes: Routes = [
  { path: '', redirectTo: routerCons.ROUTER_HOME, pathMatch: 'full' },
  { path: routerCons.ROUTER_HOME, component: HomeComponent },
  { path: routerCons.ROUTER_DRINK, component: DrinkComponent },
  { path: routerCons.ROUTER_DRINKSHOP, component: DrinkShopComponent },
  { path: routerCons.ROUTER_AUTHEMAIL, component: AuthEmailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
