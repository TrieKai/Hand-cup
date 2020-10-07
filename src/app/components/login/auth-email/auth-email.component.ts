import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { LoginService } from "src/app/service/login.service";

import * as firebase from 'firebase';

@Component({
  selector: 'app-auth-email',
  templateUrl: './auth-email.component.html',
  styleUrls: ['./auth-email.component.scss']
})
export class AuthEmailComponent implements OnInit {
  @ViewChild('newPassword', { static: false }) newPasswordRef: ElementRef<HTMLInputElement>;
  mode: string;
  oobCode: string;
  APIKey: string;
  email: string;

  constructor(
    private route: ActivatedRoute,
    private loginService: LoginService,
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
        this.verifyEmail();
        break;
      case 'resetPassword':
        this.resetPassword();
        break;
      case 'recoverEmail':
        break;
    }
  }

  verifyEmail() {

  }

  async resetPassword() {
    const email = await firebase.auth().verifyPasswordResetCode(this.oobCode)
      .catch((error) => {
        console.log(error)
      });
    this.email = email ? email : '';
  }

  async confirm() {
    await this.loginService.resetPassword(this.email, this.APIKey);
  }
}