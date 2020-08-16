import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { MaterialModule } from './util/material/material.module';
import { CommonComponentModule } from './components/common/common-component.module';

import { DrinkComponent } from './components/drink/drink.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DrinkShopComponent } from './components/drink-shop/drink-shop.component';
import { HeaderComponent } from './components/header/header.component';
import { DrinkShopMapComponent } from './components/drink-shop/drink-shop-map/drink-shop-map.component';
import { DrinkShopCardComponent } from './components/drink-shop/drink-shop-card/drink-shop-card.component';
import { DialogComponent } from './components/common/dialog/dialog.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        DrinkComponent,
        DrinkShopComponent,
        HeaderComponent,
        DrinkShopMapComponent,
        DrinkShopCardComponent,
        LoginComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        MaterialModule,
        CommonComponentModule,
        BrowserAnimationsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
    entryComponents: [
        DrinkComponent,
        DrinkShopComponent,
        DialogComponent,
        LoginComponent,
    ],
})
export class AppModule { }
