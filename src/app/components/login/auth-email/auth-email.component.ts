import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { ConstantsService } from 'src/app/util/constants/constants.service';
import { LoginService } from "src/app/service/login.service";
import { MessageService } from 'src/app/service/message.service';
import { FirebaseService } from 'src/app/service/firebase.service';

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
    private firebase: FirebaseService,
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
      default:
        // TODO: Not found page
        break;
    }
  }

  async handleVerifyEmail() {
    this.infoMessage = this.cons.INFO_MESSAGE.emailVerify;
    await this.firebase.verifyEmail(this.oobCode)
      .then((resp) => {
        const status = resp[0];
        if (status) {
          this.error = false;
        } else {
          this.error = true;
          const error = resp[1];
          this.errorMessage = error.message;
        }
      })
      .catch((error) => {
        this.error = true;
        console.log(error)
      });
  }

  async handleResetPassword() {
    this.infoMessage = this.cons.INFO_MESSAGE.resetPassword;
    await this.firebase.resetPassword(this.oobCode)
      .then((resp) => {
        const status = resp[0];
        if (status) {
          const email = resp[1];
          this.error = false;
          this.email = email ? email : '';
        } else {
          this.error = true;
          const error = resp[1];
          this.errorMessage = error.message;
        }
      })
      .catch((error) => {
        this.error = true;
        console.log(error)
      });
  }

  async confirm() {
    const password = this.newPasswordRef.nativeElement.value;
    console.log(password)
    if (password === '' || password === null || password === undefined) {
      this.message.add({ type: this.cons.MESSAGE_TYPE.error, title: this.cons.VALIDATE_MESSAGE.passwordFormat, content: '' });
      return;
    } else if (!this.loginService.validateEmail(this.email)) { return; }
    await this.loginService.resetPassword(this.email, password, this.APIKey);
  }
}