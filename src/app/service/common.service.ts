import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  detectMobile(): boolean {
    if (!window.navigator.userAgent) { return false; }
    if (
      window.navigator.userAgent.indexOf('Mobile') > -1 ||
      window.navigator.userAgent.indexOf('Android') > -1 ||
      window.navigator.userAgent.indexOf('iPhone') > -1 ||
      window.navigator.userAgent.indexOf('iPad') > -1 ||
      window.navigator.userAgent.indexOf('Windows Phone') > -1
    ) {
      return true;
    }
    return false;
  }
}
