import { Injectable, isDevMode } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { BehaviorSubject } from 'rxjs';

import { GlobalService as global } from 'src/app/service/global.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  // Tour
  private tourSubject = new Subject<number>();
  tourObservable = this.tourSubject.asObservable();

  // Component
  protected sharedComponent: commonSharedComponent = {
    loginComponentRef: null,
    profileComponentRef: null,
    reAuthComponentRef: null,
    forgotPasswordComponentRef: null,
    lockScreenComponentRef: null,
    reviewComponentRef: null,
    confirmComponentRef: null,
    tourComponentRef: null,
  };

  // Status
  protected statuses: SharedStatus = {
    onloading: false,
    lockScreen: false,
    showMap: false,
    isConfirm: false,
  };

  constructor() { }

  setTourStep(step: number) {
    this.tourSubject.next(step);
  }

  setSharedComponent(key: string, value: any): commonSharedComponent {
    if (isDevMode() || global.showLog) {
      console.log('setSharedComponent:', key, value);
    }
    if (this.hasSharedComponent(key)) {
      this.sharedComponent[key] = value;
      // this.onInitEmit();
      return this.sharedComponent[key];
    } else {
      return null;
    }
  }

  getSharedComponent(key: string) {
    return this.sharedComponent[key];
  }

  hasSharedComponent(key: string) {
    return this.sharedComponent.hasOwnProperty(key);
  }

  protected sharedData = new BehaviorSubject<commonSharedData>({
    userData: null,
    drinkShopResults: [],
  });

  public setSharedData(key: string, value: any): BehaviorSubject<any> {
    if (isDevMode() || global.showLog) {
      console.log('setSharedData:', key, value);
    }
    if (this.hasData(key)) {
      this.sharedData[key].next(value);
    } else {
      this.sharedData[key] = new BehaviorSubject(value);
    }
    return this.sharedData[key];
  }

  public getSharedData(key: string): BehaviorSubject<any> {
    if (!this.hasData(key)) {
      this.sharedData[key] = new BehaviorSubject(null);
    }
    return this.sharedData[key];
  }

  public deleteSharedData(key: string) {
    if (this.hasData(key)) {
      this.sharedData[key].next(null);
      delete this.sharedData[key];
    }
  }

  public hasData(key: string) {
    return (this.sharedData[key] instanceof BehaviorSubject);
  }

  public setStatus(key: string, value: boolean): BehaviorSubject<boolean> {
    if (isDevMode() || global.showLog) {
      console.log('setSharedStatus:', key, value);
    }
    if (this.hasStatus(key)) {
      this.statuses[key].next(value);
    } else {
      this.statuses[key] = new BehaviorSubject(value);
    }
    return this.statuses[key];
  }

  public getStatus(key: string): BehaviorSubject<boolean> {
    // We'll always ensure a Subject is returned just incase the boolean hasn't been registered "yet"
    if (!this.hasStatus(key)) {
      this.statuses[key] = new BehaviorSubject(null);
    }
    return this.statuses[key];
  }

  public deleteStatus(key: string) {
    if (this.hasStatus(key)) {
      this.statuses[key].next(null);
      delete this.statuses[key];
    }
  }

  public hasStatus(key: string) {
    return (this.statuses[key] instanceof BehaviorSubject);
  }
}