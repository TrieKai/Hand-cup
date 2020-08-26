import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private onInit = new Subject<any>();
  onInitEmitted = this.onInit.asObservable();
  commonSharedData: commonSharedData = {
    onloading: false,
    userData: null,
    loginComponentRef: null,
    profileComponentRef: null
  };

  constructor() { }

  onInitEmit() {
    console.log('onInitEmit')
    this.onInit.next();
  }

  setSharedData(key: string, value: any): commonSharedData {
    console.log('setCommonSharedData:', key, value)
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
}