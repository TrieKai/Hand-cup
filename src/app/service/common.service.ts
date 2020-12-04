import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { MessageService } from 'src/app/service/message.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { DomService } from 'src/app/util/dom.service';
import { CloudMessagingService } from 'src/app/service/cloud-messaging.service';

import { ConfirmComponent } from '../components/common/confirm/confirm.component';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private message: MessageService,
    private cons: ConstantsService,
    private domService: DomService,
    private cloudMessaging: CloudMessagingService,
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
    if (!resp || !(resp instanceof Object) || !resp.header || !this.checkStatusFormat(resp.header.status)) {
      this.message.add({ type: this.cons.MESSAGE_TYPE.error, title: this.cons.API_ERROR, content: '' });
      return false;
    }
    return true;
  }

  private checkStatusFormat(status: string): boolean {
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

  checkAPIStatus(resp: RespData): boolean {
    if (resp.header.status === this.cons.STATUS.success) {
      return true;
    } else {
      return false;
    }
  }

  async subNotification(): Promise<boolean> {
    const componentRef = this.domService.createComponent(
      ConfirmComponent,
      this.cons.SHAREDCOMPONENT.confirmComponentRef,
      { closeButton: false, title: '同意啦哪次不同意的', message: '想不想要收到最新通知~' }
    );
    this.domService.attachComponent(componentRef, this.document.body);
    return componentRef.instance.callback
      .toPromise()
      .then(async (status: boolean) => {
        if (status) {
          await Notification.requestPermission()
            .then(result => {
              switch (result) {
                case 'granted':
                  this.cloudMessaging.registerNotification();

                  this.message.add({ type: this.cons.MESSAGE_TYPE.success, title: '', content: '感謝您的訂閱!' });
                  break;
                case 'denied':
                  this.message.add({ type: this.cons.MESSAGE_TYPE.warn, title: '', content: '通知已被封鎖OAO' });
                  break;
                case 'default':
                  this.message.add({ type: this.cons.MESSAGE_TYPE.warn, title: '', content: '我晚點再問您要不要訂閱QQ' });
                  break;
              }
            });
          return true;
        } else {
          this.message.add({ type: this.cons.MESSAGE_TYPE.warn, title: '', content: '我晚點再問您要不要訂閱QQ' });
          return false;
        }
      });
  }
}
