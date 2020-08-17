import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import { RouterConfigService } from 'src/app/config/router-config.service';
import { MenuConfigService } from 'src/app/config/menu-config.service';
import { HtmlElementService } from 'src/app/shared/html-element.service';
import { DomService } from 'src/app/util/dom.service';

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
  utilitiesMenuList: Menu[] = [];
  sidebarStatus: boolean = false;
  showLogin: boolean;

  constructor(
    private routerCfg: RouterConfigService,
    private menuCfg: MenuConfigService,
    protected htmlElementService: HtmlElementService,
    private renderer: Renderer2,
    private domService: DomService,
  ) { }

  ngOnInit(): void {
    this.routerCfg.setRoutes();
    this.menuList = this.menuCfg.getMenu();
    this.utilitiesMenuList = this.menuCfg.getUtilitiesMenu();
    this.home = this.menuCfg.getHome();
  }

  ngAfterViewInit(): void {
    console.log(this.searchInput)
    this.htmlElementService.set('searchInput', this.searchInput.nativeElement);
  }

  ngOnDestroy(): void {
    this.htmlElementService.delete('searchInput');
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

  handleUtilMenu(menuData: Menu) {
    if (menuData.componentRef !== null && menuData.componentRef !== undefined) {
      const componentRef = this.domService.createComponent(menuData.componentRef);
      this.domService.attachComponent(componentRef, document.body);
    }
  }
}