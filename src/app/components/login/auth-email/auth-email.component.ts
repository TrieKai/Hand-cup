import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { ConstantsService } from 'src/app/util/constants/constants.service';
import { LoginService } from "src/app/service/login.service";
import { MessageService } from 'src/app/service/message.service';

import * as firebase from 'firebase';

@Component({
  selector: 'app-auth-email',
  templateUrl: './auth-email.component.html',
  styleUrls: ['./auth-email.component.scss']
})
export class AuthEmailComponent implements OnInit {
  @ViewChild('newPassword', { static: false }) newPasswordRef: ElementRef<HTMLInputElement>;
  infoMessage: string;
  mode: string;
  oobCode: string;
  APIKey: string;
  email: string;
  verifyEmail: boolean;
  resetPassword: boolean;
  error: boolean;
  errorMessage: string;

  constructor(
    private route: ActivatedRoute,
    private cons: ConstantsService,
    private loginService: LoginService,
    private message: MessageService,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params)
      this.mode = params.mode;
      this.oobCode = params.oobCode;
      this.APIKey = params.apiKey;
    });

    switch (this.mode) {
      case 'verifyEmail':
        this.verifyEmail = true;
        this.resetPassword = false;
        this.handleVerifyEmail();
        break;
      case 'resetPassword':
        this.resetPassword = true;
        this.verifyEmail = false;
        this.handleResetPassword();
        break;
      case 'recoverEmail':
        break;
    }
  }

  async handleVerifyEmail() {
    this.infoMessage = this.cons.INFO_MESSAGE.emailVerify;
    await firebase.auth().applyActionCode(this.oobCode)
      .then(() => {
        this.error = false;
      })
      .catch((error) => {
        this.error = true;
        this.errorMessage = error.message;
      });
  }

  async handleResetPassword() {
    this.infoMessage = this.cons.INFO_MESSAGE.resetPassword;
    await firebase.auth().verifyPasswordResetCode(this.oobCode)
      .then((email) => {
        if (email) {
          this.error = false;
          this.email = email ? email : '';
        }
      })
      .catch((error) => {
        this.error = true;
        this.errorMessage = error.message;
      });
  }

  async confirm() {
    const password = this.newPasswordRef.nativeElement.value;
    console.log(password)
    if (password === '' || password === null || password === undefined) {
      this.message.add({ type: this.cons.MESSAGE_TYPE.error, title: '密碼格式錯誤', content: '' });
      return;
    } else {
      await this.loginService.resetPassword(this.email, password, this.APIKey);
    }
  }
}