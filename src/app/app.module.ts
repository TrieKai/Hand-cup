import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

import { MapComponent } from './components/map/map.component';
import { DrinkComponent } from './components/drink/drink.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        MapComponent,
        DrinkComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent],
    entryComponents: [
        MapComponent,
        DrinkComponent,
    ],
})
export class AppModule { }
