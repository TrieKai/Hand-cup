import { Component, OnInit, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { SwPush } from '@angular/service-worker';
import * as firebase from 'firebase/app';
import 'firebase/messaging';

import { GlobalService as global } from 'src/app/service/global.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  onloading: boolean = false;
  onloadingSB: BehaviorSubject<boolean>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private sharedService: SharedService,
    private cons: ConstantsService,
    private swPush: SwPush,
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      (window as any).showLog = (show: boolean) => { global.showLog = show; };
      window.addEventListener('install', (event) => {
        console.log('install', event);
      });
    }

    const messaging = firebase.messaging();
    navigator.serviceWorker.ready.then(registration => {
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

    this.onloadingSB = this.sharedService.getStatus(this.cons.SHAREDSTATUS.onloading);
    this.onloadingSB
      .subscribe((status) => {
        this.onloading = status;
      });
  }

  ngOnDestroy(): void {
    if (this.onloadingSB) {
      this.sharedService.deleteStatus(this.cons.SHAREDSTATUS.onloading);
      this.onloadingSB.unsubscribe();
    }
  }
}
