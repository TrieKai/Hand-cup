import { Component, OnInit, ViewChild, ElementRef, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { DomService } from 'src/app/util/dom.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { LoginService } from 'src/app/service/login.service';
import { MessageService } from 'src/app/service/message.service';

import { ForgotPasswordComponent } from '../login/forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginEmail', { static: false }) loginEmailRef: ElementRef<HTMLInputElement>;
  @ViewChild('loginPassword', { static: false }) loginPasswordRef: ElementRef<HTMLInputElement>;
  @ViewChild('signUpEmail', { static: false }) signUpEmailRef: ElementRef<HTMLInputElement>;
  @ViewChild('signUpPassword', { static: false }) signUpPasswordRef: ElementRef<HTMLInputElement>;
  componentKey: string;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private domService: DomService,
    private sharedService: SharedService,
    private cons: ConstantsService,
    private renderer: Renderer2,
    private loginService: LoginService,
    private message: MessageService,
  ) { }

  ngOnInit() {
    this.componentKey = this.cons.SHAREDCOMPONENT.loginComponentRef;
  }

  async login() {
    const email = this.loginEmailRef.nativeElement.value;
    const password = this.loginPasswordRef.nativeElement.value;
    // console.log('Login: ', email, password)

    this.renderer.removeClass(this.loginEmailRef.nativeElement, 'error');
    this.renderer.removeClass(this.loginPasswordRef.nativeElement, 'error');
    await new Promise(resolve => {
      setTimeout(() => {
        if (email === '' || email === null || email === undefined) {
          this.renderer.addClass(this.loginEmailRef.nativeElement, 'error');
          return;
        } else if (!this.loginService.validateEmail(email)) { return; }
        if (password === '' || password === null || password === undefined) {
          this.renderer.addClass(this.loginPasswordRef.nativeElement, 'error');
          this.message.add({ type: this.cons.MESSAGE_TYPE.error, title: this.cons.VALIDATE_MESSAGE.passwordFormat, content: '' });
          return;
        }
        resolve();
      }, 10);
    });
    // TODO: Better way to replace setTimeout

    await this.loginService.loginFireBase(email, password)
      .then(async (status) => {
        if (status) {
          this.domService.destroyComponent(this.sharedService.getSharedComponent(this.cons.SHAREDCOMPONENT.loginComponentRef));
          // await this.loginService.updatePassword(password); // TODO: Forgot password email by normal process
          await this.loginService.login(false, password);
        }
      });
  }

  async signUp() {
    const email = this.signUpEmailRef.nativeElement.value;
    const password = this.signUpPasswordRef.nativeElement.value;
    // console.log('SignUp: ', email, password)

    this.renderer.removeClass(this.signUpEmailRef.nativeElement, 'error');
    this.renderer.removeClass(this.signUpPasswordRef.nativeElement, 'error');
    await new Promise(resolve => {
      setTimeout(() => {
        if (email === '' || email === null || email === undefined) {
          this.renderer.addClass(this.signUpEmailRef.nativeElement, 'error');
          return;
        } else if (!this.loginService.validateEmail(email)) { return; }
        if (password === '' || password === null || password === undefined) {
          this.renderer.addClass(this.signUpPasswordRef.nativeElement, 'error');
          this.message.add({ type: this.cons.MESSAGE_TYPE.error, title: this.cons.VALIDATE_MESSAGE.passwordFormat, content: '' });
          return;
        } else if (!this.loginService.validatePassword(password)) { return; }
        resolve();
      }, 10);
    });
    // TODO: Better way to replace setTimeout

    await this.loginService.signUpFireBase(email, password)
      .then(async (status) => {
        if (status) {
          this.signUpEmailRef.nativeElement.value = '';
          this.signUpPasswordRef.nativeElement.value = '';
          await this.loginService.signUp(null, password);
          await this.loginService.login(false, password);
        }
      });
  }

  async signUpWithGoogle() {
    await this.loginService.signUpWithGoogle()
      .then(async (status) => {
        if (status) {
          this.domService.destroyComponent(this.sharedService.getSharedComponent(this.cons.SHAREDCOMPONENT.loginComponentRef));
          await this.loginService.signUp(this.cons.THIRD_PARTY_TYPE.google);
          await this.loginService.login(true);
        }
      });
  }

  async signUpWithFacebook() {
    await this.loginService.signUpWithFacebook()
      .then(async (status) => {
        if (status) {
          this.domService.destroyComponent(this.sharedService.getSharedComponent(this.cons.SHAREDCOMPONENT.loginComponentRef));
          await this.loginService.signUp(this.cons.THIRD_PARTY_TYPE.facebook);
          await this.loginService.login(true);
        }
      });
  }

  async forgotPassword() {
    const componentRef = this.domService.createComponent(ForgotPasswordComponent, this.cons.SHAREDCOMPONENT.forgotPasswordComponentRef);
    this.domService.attachComponent(componentRef, this.document.body);
  }
}