import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { SwUpdate } from '@angular/service-worker';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './util/material/material.module';
import { CommonComponentModule } from './components/common/common-component.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { DrinkComponent } from './components/drink/drink.component';
import { DrinkShopComponent } from './components/drink-shop/drink-shop.component';
import { HeaderComponent } from './components/header/header.component';
import { DrinkShopMapComponent } from './components/drink-shop/drink-shop-map/drink-shop-map.component';
import { DrinkShopCardComponent } from './components/drink-shop/drink-shop-card/drink-shop-card.component';
import { DialogComponent } from './components/common/dialog/dialog.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChosenCardComponent } from './components/drink-shop/drink-shop-card/chosen-card/chosen-card.component';
import { PreviewCardComponent } from './components/drink-shop/drink-shop-card/preview-card/preview-card.component';
import { ReAuthComponent } from './components/profile/re-auth/re-auth.component';
import { ForgotPasswordComponent } from './components/login/forgot-password/forgot-password.component';
import { AuthEmailComponent } from './components/login/auth-email/auth-email.component';
import { LockScreenComponent } from './components/common/lock-screen/lock-screen.component';
import { ReviewComponent } from './components/drink-shop/drink-shop-card/review/review.component';
import { ConfirmComponent } from './components/common/confirm/confirm.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MyMapComponent } from './components/my-map/my-map.component';

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
    ProfileComponent,
    ChosenCardComponent,
    PreviewCardComponent,
    ReAuthComponent,
    ForgotPasswordComponent,
    AuthEmailComponent,
    ReviewComponent,
    ConfirmComponent,
    MyMapComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    CommonComponentModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    DrinkComponent,
    DrinkShopComponent,
    DialogComponent,
    LoginComponent,
    ProfileComponent,
    ReAuthComponent,
    ForgotPasswordComponent,
    AuthEmailComponent,
    LockScreenComponent,
    ReviewComponent,
    ConfirmComponent,
  ],
})
export class AppModule {
  constructor(swUpdate: SwUpdate) {
    swUpdate.available.subscribe(() => {
      window.location.reload();
    });
  }
}
