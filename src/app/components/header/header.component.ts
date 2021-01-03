import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { RouterConfigService } from 'src/app/config/router-config.service';
import { MenuConfigService } from 'src/app/config/menu-config.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { HtmlElementService } from 'src/app/shared/html-element.service';
import { DomService } from 'src/app/util/dom.service';
import { LoginService } from 'src/app/service/login.service';
import { SharedService } from 'src/app/shared/shared.service';
import { MessageService } from 'src/app/service/message.service';
import { RouterConstantsService as routerCons } from '../../util/constants/router-constants.service';

import { LockScreenComponent } from '../common/lock-screen/lock-screen.component';
import { LoginComponent } from '../login/login.component';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchComponent', { static: false }) searchComponent: any;
  @ViewChild('sidebarIconToggle', { static: false }) sidebarToggle: ElementRef;
  @ViewChild('sidebarMenu', { static: false }) sidebarMenu: ElementRef;
  home: Menu;
  menuList: Menu[] = [];
  // utilitiesMenuList: Menu[] = [];
  sidebarStatus: boolean = false;
  isLogin: boolean;
  userPhotoURL: string;
  showMenu: boolean;
  loginSubscribe: Subscription;
  sharedSubscribe: Subscription;
  tourSubscribe: Subscription;
  lockScreenBS: BehaviorSubject<boolean>;
  userDataBS: BehaviorSubject<any>;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private routerCfg: RouterConfigService,
    private cons: ConstantsService,
    private menuCfg: MenuConfigService,
    protected htmlElementService: HtmlElementService,
    private renderer: Renderer2,
    private domService: DomService,
    private loginService: LoginService,
    private sharedService: SharedService,
    private message: MessageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.routerCfg.setRoutes();
    this.menuList = this.menuCfg.getMenu();
    // this.utilitiesMenuList = this.menuCfg.getUtilitiesMenu();
    this.home = this.menuCfg.getHome();
    this.loginSubscribe = this.loginService.checkUserLoggedIn()
      .subscribe(status => {
        if (status === null) { return; }
        this.isLogin = status;
      });
    this.userDataBS = this.sharedService.getSharedData(this.cons.SHAREDDATA.userData);
    this.userDataBS.subscribe((userData) => {
      if (userData) { this.userPhotoURL = userData.photoURL; }
    });
    this.tourSubscribe = this.sharedService.tourObservable
      .subscribe(step => {
        switch (step) {
          case 2:
            this.router.navigate([`/${routerCons.ROUTER_DRINKSHOP}`]);
            break;
            case 3:
            this.router.navigate([`/${routerCons.ROUTER_DRINK}`]);
            break;
          case 4:
            this.router.navigate([`/${routerCons.ROUTER_MYMAP}`]);
            break;
        }
        if (step <= 4 && !this.showMenu) {
          this.handleSidebar(true);
        } else if (step > 5 && this.showMenu) {
          this.handleSidebar(false);
        }
      });
  }

  ngAfterViewInit(): void {
    // console.log(this.searchComponent)
    this.htmlElementService.set(this.cons.HTMLSHAREDDATA.searchInputRef, this.searchComponent.searchInputRef.nativeElement);

    this.lockScreenBS = this.sharedService.setStatus(this.cons.SHAREDSTATUS.lockScreen, false);
    this.lockScreenBS
      .pipe()
      .subscribe((status) => {
        this.handleSidebar(status);
      });
  }

  ngOnDestroy(): void {
    this.htmlElementService.delete(this.cons.HTMLSHAREDDATA.searchInputRef);
    if (this.loginSubscribe) {
      this.loginSubscribe.unsubscribe();
    }
    if (this.sharedSubscribe) {
      this.sharedSubscribe.unsubscribe();
    }
    if (this.lockScreenBS) {
      this.sharedService.deleteStatus(this.cons.SHAREDSTATUS.lockScreen);
      this.lockScreenBS.unsubscribe();
    }
    if (this.userDataBS) {
      this.sharedService.deleteSharedData(this.cons.SHAREDDATA.userData);
      this.lockScreenBS.unsubscribe();
    }
    if (this.tourSubscribe) {
      this.tourSubscribe.unsubscribe();
    }
  }

  handleSidebar(status: boolean) {
    this.showMenu = status;
    if (status) {
      this.renderer.addClass(this.sidebarToggle.nativeElement, 'open'); // Open
      this.sidebarStatus = true;

      const componentRef = this.domService.createComponent(
        LockScreenComponent,
        this.cons.SHAREDCOMPONENT.lockScreenComponentRef,
        { zIndex: 30 }
      );
      this.domService.attachComponent(componentRef, this.document.body);
      return;
    } else {
      this.renderer.removeClass(this.sidebarToggle.nativeElement, 'open'); // Close
      this.sidebarStatus = false;
      const lockScreenComponentRef = this.sharedService.getSharedComponent(this.cons.SHAREDCOMPONENT.lockScreenComponentRef);
      if (lockScreenComponentRef) { this.domService.destroyComponent(lockScreenComponentRef); }
      return;
    }
  }

  login() {
    const componentRef = this.domService.createComponent(LoginComponent, this.cons.SHAREDCOMPONENT.loginComponentRef);
    this.domService.attachComponent(componentRef, this.document.body);
    // this.isLogin = true;
  }

  logout() {
    this.loginService.logOut();
    // this.isLogin = false;
  }

  profile() {
    const userData = this.loginService.getFirebaseUserData();
    if (userData) {
      const componentRef = this.domService.createComponent(ProfileComponent, this.cons.SHAREDCOMPONENT.profileComponentRef);
      this.domService.attachComponent(componentRef, this.document.body);
    } else {
      this.message.add({ type: this.cons.MESSAGE_TYPE.warn, title: '請先登入唷', content: '' });
    }
  }
}
