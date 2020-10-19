import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';

import { RouterConfigService } from 'src/app/config/router-config.service';
import { MenuConfigService } from 'src/app/config/menu-config.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { HtmlElementService } from 'src/app/shared/html-element.service';
import { DomService } from 'src/app/util/dom.service';
import { LoginService } from 'src/app/service/login.service';
import { SharedService } from 'src/app/shared/shared.service';

import { LoginComponent } from '../login/login.component';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchInput', { static: false }) searchInput: ElementRef;
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
    console.log(this.searchInput)
    this.htmlElementService.set('searchInput', this.searchInput.nativeElement);
  }

  ngOnDestroy(): void {
    this.htmlElementService.delete('searchInput');
    if (this.loginSubscribe) {
      this.loginSubscribe.unsubscribe();
    }
    if (this.sharedSubscribe) {
      this.sharedSubscribe.unsubscribe();
    }
  }

  handleSidebar(status?: boolean) {
    // When status variable not undefined
    if (status !== undefined) {
      if (status) {
        this.renderer.addClass(this.sidebarToggle.nativeElement, 'open'); // Open
        this.sidebarStatus = true;
        return;
      } else if (!status) {
        this.renderer.removeClass(this.sidebarToggle.nativeElement, 'open'); // Close
        this.sidebarStatus = false;
        return;
      }
    } else {
      this.sidebarStatus = !this.sidebarStatus; // Change status
      if (this.sidebarStatus) {
        this.renderer.addClass(this.sidebarToggle.nativeElement, 'open'); // Open
      } else {
        this.renderer.removeClass(this.sidebarToggle.nativeElement, 'open'); // Close
      }
    }
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
    const componentRef = this.domService.createComponent(ProfileComponent, this.cons.SHAREDDATA.profileComponentRef);
    this.domService.attachComponent(componentRef, this.document.body);
  }
}
