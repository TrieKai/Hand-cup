import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { MaterialModule } from './util/material/material.module';

import { MapComponent } from './components/map/map.component';
import { DrinkComponent } from './components/drink/drink.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DrinkShopComponent } from './components/drink-shop/drink-shop.component';
import { HeaderComponent } from './components/header/header.component';
import { DrinkShopMapComponent } from './components/drink-shop/drink-shop-map/drink-shop-map.component';
import { DrinkShopCardComponent } from './components/drink-shop/drink-shop-card/drink-shop-card.component';
import { MessageComponent } from './components/common/message/message.component';
import { MessageBlockComponent } from './components/common/message/message-block/message-block.component';
import { LockLoadingComponent } from './components/common/lock-loading/lock-loading.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        MapComponent,
        DrinkComponent,
        DrinkShopComponent,
        HeaderComponent,
        DrinkShopMapComponent,
        DrinkShopCardComponent,
        MessageComponent,
        MessageBlockComponent,
        LockLoadingComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        MaterialModule,
        BrowserAnimationsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
    entryComponents: [
        MapComponent,
        DrinkComponent,
        DrinkShopComponent,
    ],
})
export class AppModule { }
