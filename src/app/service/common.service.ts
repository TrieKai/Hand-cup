import { Injectable } from '@angular/core';

import { MessageService } from 'src/app/service/message.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private message: MessageService,
    private cons: ConstantsService,
  ) { }

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

  checkAPIResp(resp: RespData): boolean {
    if (!resp || !(resp instanceof Object) || !resp.header || !this.checkStatus(resp.header.status)) {
      this.message.add({ type: this.cons.MESSAGE_TYPE.error, title: this.cons.API_ERROR, content: '' });
      return false;
    }
    return true;
  }

  private checkStatus(status: string): boolean {
    switch (status) {
      case this.cons.STATUS.success:
        return true;
      case this.cons.STATUS.error:
        return true;
      default:
        this.message.add({ type: this.cons.MESSAGE_TYPE.error, title: this.cons.API_STATUS_FORMAT_ERROR, content: '' });
    }
    return false;
  }
}
