import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import { DomService } from 'src/app/util/dom.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginEmail', { static: false }) loginEmail: ElementRef;
  @ViewChild('loginPassword', { static: false }) loginPassword: ElementRef;
  @ViewChild('signUpEmail', { static: false }) signUpEmail: ElementRef;
  @ViewChild('signUpPassword', { static: false }) signUpPassword: ElementRef;

  constructor(
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
    const email = this.loginEmail.nativeElement.value;
    const password = this.loginPassword.nativeElement.value;
    console.log('Login: ', email, password)

    this.renderer.removeClass(this.loginEmail.nativeElement, 'error');
    this.renderer.removeClass(this.loginPassword.nativeElement, 'error');
    await new Promise(resolve => {
      setTimeout(() => {
        if (email === '' || email === null || email === undefined) {
          this.renderer.addClass(this.loginEmail.nativeElement, 'error');
          return;
        }
        if (password === '' || password === null || password === undefined) {
          this.renderer.addClass(this.loginPassword.nativeElement, 'error');
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
    const email = this.signUpEmail.nativeElement.value;
    const password = this.signUpPassword.nativeElement.value;
    console.log('SignUp: ', email, password)

    this.renderer.removeClass(this.signUpEmail.nativeElement, 'error');
    this.renderer.removeClass(this.signUpPassword.nativeElement, 'error');
    await new Promise(resolve => {
      setTimeout(() => {
        if (email === '' || email === null || email === undefined) {
          this.renderer.addClass(this.signUpEmail.nativeElement, 'error');
          return;
        }
        if (password === '' || password === null || password === undefined) {
          this.renderer.addClass(this.signUpPassword.nativeElement, 'error');
          return;
        }
        resolve();
      }, 10);
    });
    // TODO: Better way to replace setTimeout

    const signUpResult = await this.loginService.signUp(email, password)
      .then((status) => {
        if (status) {
          this.signUpEmail.nativeElement.value = '';
          this.signUpPassword.nativeElement.value = '';
        }
      });
    console.log('Sign up result: ', signUpResult)
  }
}