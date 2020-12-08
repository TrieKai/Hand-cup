import { Component, OnInit, PLATFORM_ID, Inject, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import { GlobalService as global } from 'src/app/service/global.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  onloading: boolean = false;
  onloadingSB: BehaviorSubject<boolean>;
  installPromptEvent: any; // PWA install event
  showTime: number; // PWA show install's prompt time

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private sharedService: SharedService,
    private cons: ConstantsService,
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      (window as any).showLog = (show: boolean) => { global.showLog = show; };
      window.addEventListener('install', (event) => {
        console.log('install', event);
      });
    }

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

  ngAfterViewInit(): void {
    // PWA
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.installPromptEvent = e;
      const data = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
      const chromeVersion = (data && data.length >= 2) ? parseInt(data[2], 10) : null;
      if (chromeVersion && this.installPromptEvent.prompt) {
        // 延遲一段時間才顯示 prompt
        setTimeout(() => {
          // 如果 Chrome 版本是 67（含）以下，可以直接呼叫
          if (chromeVersion <= 67) {
            this.installPromptEvent.prompt();
            return;
          }
          // 否則的話必須透過 user action 主動觸發
          // 這邊幫 #root 加上 event listener，代表點擊螢幕任何一處都會顯示 prompt
          this.document.querySelector('#root').addEventListener('click', this.addToHomeScreen);
        }, this.showTime);
      }
    });
  }

  addToHomeScreen() {
    console.log('aaa')
    if (this.installPromptEvent) {
      console.log('bbb')
      this.installPromptEvent.prompt();
      this.installPromptEvent = null;
      this.document.querySelector('#root').removeEventListener('click', this.addToHomeScreen);
    }
  }
}
