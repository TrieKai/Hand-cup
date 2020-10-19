import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RouterConstantsService as routerCons } from './util/constants/router-constants.service';

import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: routerCons.ROUTER_HOME, pathMatch: 'full' },
  { path: routerCons.ROUTER_HOME, component: HomeComponent },
  { path: '**', redirectTo: routerCons.ROUTER_HOME },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
