import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import { DomService } from 'src/app/util/dom.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('username', { static: false }) username: ElementRef;
  @ViewChild('password', { static: false }) password: ElementRef;

  constructor(
    private domService: DomService,
    private sharedService: SharedService,
    private cons: ConstantsService,
    private renderer: Renderer2,
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.domService.destroyComponent(this.sharedService.getSharedData(this.cons.SHAREDDATA.loginComponentRef));
  }

  login() {
    const username = this.username.nativeElement.value;
    const password = this.password.nativeElement.value;
    console.log(username, password)

    if (username === '' || username === null || username === undefined) {
      this.renderer.addClass(this.username.nativeElement, 'error');
    }
    if (password === '' || password === null || password === undefined) {
      this.renderer.addClass(this.password.nativeElement, 'error');
    }
    setTimeout(() => {
      this.renderer.removeClass(this.username.nativeElement, 'error');
      this.renderer.removeClass(this.password.nativeElement, 'error');
    }, 500);
    // TODO: Better way to replace setTimeout
  }
}