import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  detectDeviceType(): DeviceType {
    if (!window.navigator.userAgent) { return null; }

    const userAgent = window.navigator.userAgent.toLowerCase();
    return {
      mobile: /(ipod|ipad|iphone|android|mobile)/.test(userAgent) ? true : false,
      ios: /(ipod|ipad|iphone)/.test(userAgent) ? true : false,
      android: /(android)/.test(userAgent) ? true : false,
      chrome: /(chrome)/.test(userAgent) ? true : false,
      safari: /(safari)/.test(userAgent) && !/(chrome)/.test(userAgent) ? true : false,
      firefox: /(firefox)/.test(userAgent) ? true : false,
      ie: /(msie)/.test(userAgent) ? true : false,
      edge: /(edge|trident)/.test(userAgent) ? true : false,
      webView: /(fbav|line|wv|iab|webview)/.test(userAgent) ? true : false,
    };
  }
}
