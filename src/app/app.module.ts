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

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        MapComponent,
        DrinkComponent,
        DrinkShopComponent,
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
