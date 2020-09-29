import { Component, OnInit, ViewChild, ElementRef, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { DomService } from 'src/app/util/dom.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { LoginService } from 'src/app/service/login.service';

import { ForgotPasswordComponent } from 'src/app/components/login/forgot-password/forgot-password.component';

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

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private domService: DomService,
    private sharedService: SharedService,
    private cons: ConstantsService,
    private renderer: Renderer2,
    private loginService: LoginService,
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.domService.destroyComponent(this.sharedService.getSharedData(this.cons.SHAREDDATA.loginComponentRef));
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
        }
        if (password === '' || password === null || password === undefined) {
          this.renderer.addClass(this.loginPasswordRef.nativeElement, 'error');
          return;
        }
        resolve();
      }, 10);
    });
    // TODO: Better way to replace setTimeout

    await this.loginService.login(email, password)
      .then((status) => {
        if (status) {
          this.domService.destroyComponent(this.sharedService.getSharedData(this.cons.SHAREDDATA.loginComponentRef));
        }
      });
  }

  async signUp() {
    const email = this.signUpEmailRef.nativeElement.value;
    const password = this.signUpPasswordRef.nativeElement.value;
    console.log('SignUp: ', email, password)

    this.renderer.removeClass(this.signUpEmailRef.nativeElement, 'error');
    this.renderer.removeClass(this.signUpPasswordRef.nativeElement, 'error');
    await new Promise(resolve => {
      setTimeout(() => {
        if (email === '' || email === null || email === undefined) {
          this.renderer.addClass(this.signUpEmailRef.nativeElement, 'error');
          return;
        }
        if (password === '' || password === null || password === undefined) {
          this.renderer.addClass(this.signUpPasswordRef.nativeElement, 'error');
          return;
        }
        resolve();
      }, 10);
    });
    // TODO: Better way to replace setTimeout

    const signUpResult = await this.loginService.signUp(email, password)
      .then((status) => {
        if (status) {
          this.signUpEmailRef.nativeElement.value = '';
          this.signUpPasswordRef.nativeElement.value = '';
        }
      });
    console.log('Sign up result: ', signUpResult)
  }

  async signUpWithGoogle() {
    await this.loginService.signUpWithGoogle()
      .then((status) => {
        if (status) {
          this.domService.destroyComponent(this.sharedService.getSharedData(this.cons.SHAREDDATA.loginComponentRef));
        }
      });
  }

  async signUpWithFacebook() {
    await this.loginService.signUpWithFacebook()
      .then((status) => {
        if (status) {
          this.domService.destroyComponent(this.sharedService.getSharedData(this.cons.SHAREDDATA.loginComponentRef));
        }
      });
  }

  async forgotPassword() {
    const componentRef = this.domService.createComponent(ForgotPasswordComponent, this.cons.SHAREDDATA.forgotPasswordComponentRef);
    this.domService.attachComponent(componentRef, this.document.body);
  }
}