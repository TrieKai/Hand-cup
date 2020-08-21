import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { RouterConfigService } from 'src/app/config/router-config.service';
import { MenuConfigService } from 'src/app/config/menu-config.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { HtmlElementService } from 'src/app/shared/html-element.service';
import { DomService } from 'src/app/util/dom.service';
import { LoginService } from 'src/app/service/login.service';

import { LoginComponent } from 'src/app/components/login/login.component';
import { ProfileComponent } from 'src/app/components/profile/profile.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChild('searchInput', { static: false }) searchInput: ElementRef;
  @ViewChild('sidebarIconToggle', { static: false }) sidebarToggle: ElementRef;
  @ViewChild('sidebarMenu', { static: false }) sidebarMenu: ElementRef;
  home: Menu;
  menuList: Menu[] = [];
  // utilitiesMenuList: Menu[] = [];
  sidebarStatus: boolean = false;
  isLogin: boolean;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private routerCfg: RouterConfigService,
    private cons: ConstantsService,
    private menuCfg: MenuConfigService,
    protected htmlElementService: HtmlElementService,
    private renderer: Renderer2,
    private domService: DomService,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
    this.routerCfg.setRoutes();
    this.menuList = this.menuCfg.getMenu();
    // this.utilitiesMenuList = this.menuCfg.getUtilitiesMenu();
    this.home = this.menuCfg.getHome();
    this.loginService.checkUserLoggedIn().subscribe(status => {
      this.isLogin = status;
    });
  }

  ngAfterViewInit(): void {
    console.log(this.searchInput)
    this.htmlElementService.set('searchInput', this.searchInput.nativeElement);
  }

  ngOnDestroy(): void {
    this.htmlElementService.delete('searchInput');
    this.loginService.checkUserLoggedIn().unsubscribe();
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