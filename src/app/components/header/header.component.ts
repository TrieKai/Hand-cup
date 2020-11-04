import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';

import { RouterConfigService } from 'src/app/config/router-config.service';
import { MenuConfigService } from 'src/app/config/menu-config.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { HtmlElementService } from 'src/app/shared/html-element.service';
import { DomService } from 'src/app/util/dom.service';
import { LoginService } from 'src/app/service/login.service';
import { SharedService } from 'src/app/shared/shared.service';
import { MessageService } from 'src/app/service/message.service';

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
  loginSubscribe: Subscription;
  sharedSubscribe: Subscription;
  lockScreenBS: BehaviorSubject<boolean>;

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
  ) { }

  ngOnInit(): void {
    this.routerCfg.setRoutes();
    this.menuList = this.menuCfg.getMenu();
    // this.utilitiesMenuList = this.menuCfg.getUtilitiesMenu();
    this.home = this.menuCfg.getHome();
    this.loginSubscribe = this.loginService.checkUserLoggedIn().subscribe(status => {
      this.isLogin = status;
    });
    this.sharedSubscribe = this.sharedService.onInitEmitted.subscribe(() => {
      const userData: firebase.UserInfo = this.sharedService.getSharedData(this.cons.SHAREDDATA.userData);
      if (userData) { this.userPhotoURL = userData.photoURL; }
    });
  }

  ngAfterViewInit(): void {
    console.log(this.searchComponent)
    this.htmlElementService.set(this.cons.HTMLSHAREDDATA.searchInputRef, this.searchComponent.searchInputRef.nativeElement);

    this.lockScreenBS = this.sharedService.setStatus(this.cons.SHAREDDATA.lockScreen, false);
    this.lockScreenBS.subscribe((status) => {
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
      this.lockScreenBS.unsubscribe();
    }
  }

  handleSidebar(status?: boolean) {
    // When status variable not undefined
    if (status !== undefined) {
      if (status) {
        this.renderer.addClass(this.sidebarToggle.nativeElement, 'open'); // Open
        this.sidebarStatus = true;

        const componentRef = this.domService.createComponent(
          LockScreenComponent,
          this.cons.SHAREDDATA.lockScreenComponentRef
        );
        this.domService.attachComponent(componentRef, this.document.body);
        return;
      } else if (!status) {
        this.renderer.removeClass(this.sidebarToggle.nativeElement, 'open'); // Close
        this.sidebarStatus = false;
        const lockScreenComponentRef = this.sharedService.getSharedData(this.cons.SHAREDDATA.lockScreenComponentRef);
        if (lockScreenComponentRef) { this.domService.destroyComponent(lockScreenComponentRef); }
        // this.domService.destroyComponent(this.sharedService.getSharedData(this.cons.SHAREDDATA.lockScreenComponentRef));
        return;
      }
    } else {
      this.sidebarStatus = !this.sidebarStatus; // Change status
      if (this.sidebarStatus) {
        this.renderer.addClass(this.sidebarToggle.nativeElement, 'open'); // Open

        const componentRef = this.domService.createComponent(
          LockScreenComponent,
          this.cons.SHAREDDATA.lockScreenComponentRef
        );
        this.domService.attachComponent(componentRef, this.document.body);
      } else {
        this.renderer.removeClass(this.sidebarToggle.nativeElement, 'open'); // Close
        this.domService.destroyComponent(this.sharedService.getSharedData(this.cons.SHAREDDATA.lockScreenComponentRef));
      }
    }
  }

  doSearch(searchInput: any) {
    console.log(searchInput)
    // searchInput.onchange();
    // TODO: Fix Search input
  }

  login() {
    const componentRef = this.domService.createComponent(LoginComponent, this.cons.SHAREDDATA.loginComponentRef);
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
      const componentRef = this.domService.createComponent(ProfileComponent, this.cons.SHAREDDATA.profileComponentRef);
      this.domService.attachComponent(componentRef, this.document.body);
    } else {
      this.message.add({ type: this.cons.MESSAGE_TYPE.warn, title: '請先登入唷', content: '' });
    }
  }
}
