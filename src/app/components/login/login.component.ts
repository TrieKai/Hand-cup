import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import { DomService } from 'src/app/util/dom.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('username', { static: false }) username: ElementRef;
  @ViewChild('password', { static: false }) password: ElementRef;
  @ViewChild('nickname', { static: false }) nickname: ElementRef;
  @ViewChild('email', { static: false }) email: ElementRef;

  constructor(
    private domService: DomService,
    private sharedService: SharedService,
    private cons: ConstantsService,
    private renderer: Renderer2,
    private firebaseService: FirebaseService,
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

    this.renderer.removeClass(this.username.nativeElement, 'error');
    this.renderer.removeClass(this.password.nativeElement, 'error');
    setTimeout(() => {
      if (username === '' || username === null || username === undefined) {
        this.renderer.addClass(this.username.nativeElement, 'error');
        return;
      }
      if (password === '' || password === null || password === undefined) {
        this.renderer.addClass(this.password.nativeElement, 'error');
        return;
      }
    }, 10);
    // TODO: Better way to replace setTimeout
  }

  async signup() {
    const nickname = this.nickname.nativeElement.value;
    const email = this.email.nativeElement.value;
    console.log(nickname, email)

    this.renderer.removeClass(this.nickname.nativeElement, 'error');
    this.renderer.removeClass(this.email.nativeElement, 'error');
    setTimeout(() => {
      if (nickname === '' || nickname === null || nickname === undefined) {
        this.renderer.addClass(this.nickname.nativeElement, 'error');
        return;
      }
      if (email === '' || email === null || email === undefined) {
        this.renderer.addClass(this.email.nativeElement, 'error');
        return;
      }
    }, 10);

    await this.firebaseService.register(email, nickname);
  }
}