import { Injectable, isDevMode } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { BehaviorSubject } from 'rxjs';

import { GlobalService as global } from 'src/app/service/global.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private onInit = new Subject<any>();
  onInitEmitted = this.onInit.asObservable();
  commonSharedData: commonSharedData = {
    userData: null,
    loginComponentRef: null,
    profileComponentRef: null,
    reAuthComponentRef: null,
    forgotPasswordComponentRef: null,
    lockScreenComponentRef: null,
  };

  constructor() { }

  onInitEmit() {
    if (isDevMode() || global.showLog) {
      console.log('onInitEmit');
    }
    this.onInit.next();
  }

  setSharedData(key: string, value: any): commonSharedData {
    if (isDevMode() || global.showLog) {
      console.log('setCommonSharedData:', key, value);
    }
    if (this.hasKey(key)) {
      this.commonSharedData[key] = value;
      this.onInitEmit();
      return this.commonSharedData[key];
    } else {
      return null;
    }
  }

  getSharedData(key: string) {
    return this.commonSharedData[key];
  }

  hasKey(key: string) {
    return this.commonSharedData.hasOwnProperty(key);
  }

  protected statuses: SharedStatus = {
    onloading: false,
    lockScreen: false,
  };

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