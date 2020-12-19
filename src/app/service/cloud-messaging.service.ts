import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { NavigationEnd, Router } from '@angular/router';

import * as firebase from 'firebase/app';
import 'firebase/messaging';

import { GlobalService as global } from '../service/global.service';

@Injectable({
  providedIn: 'root'
})
export class CloudMessagingService {

  constructor(
    private swPush: SwPush,
    private router: Router,
  ) {
    // Reset value when change url
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        global.showSubNotification = true;
      }
    });
  }

  registerNotification() {
    const messaging = firebase.messaging();
    navigator.serviceWorker.ready
      .then(registration => {
        if (
          !!registration &&
          registration.active &&
          registration.active.state &&
          registration.active.state === 'activated'
        ) {
          messaging.useServiceWorker(registration);
          messaging
            .requestPermission()
            .then(() => messaging.getToken())
            .then(token => console.log('Permission granted!', token));
        } else {
          console.warn(
            'No active service worker found, not able to get firebase messaging.'
          );
        }
      });

    this.swPush.messages.subscribe(msg => {
      console.log(msg);
    });
  }
}
