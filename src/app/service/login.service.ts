import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { RouterConstantsService } from '../util/constants/router-constants.service';
import { FirebaseService } from 'src/app/service/firebase.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { MessageService } from 'src/app/service/message.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  signIn: boolean;

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private cons: ConstantsService,
    private message: MessageService,
  ) {
    firebaseService.checkAuthStatus();
  }

  checkUserLoggedIn(): Subject<boolean> {
    return this.firebaseService.userLoggedIn;
  }

  async login(email: string, password: string): Promise<boolean> {
    return await this.firebaseService.login(email, password)
      .then((status) => {
        const user = this.firebaseService.getUserData();
        if (user && !user.emailVerified) {
          this.message.add({ type: this.cons.MESSAGE_TYPE.warn, title: '警告', content: '請去註冊信箱完成驗證!' });
        }
        return status;
      });
  }

  async signUp(email: string, password: string): Promise<boolean> {
    return await this.firebaseService.signUp(email, password);
  }

  async signUpWithGoogle(): Promise<boolean> {
    return await this.firebaseService.signUpWithGoogle();
  }

  async signUpWithFacebook(): Promise<boolean> {
    return await this.firebaseService.signUpWithFacebook();
  }

  async reAuth(email: string, password: string): Promise<boolean> {
    return await this.firebaseService.reAuth(email, password);
  }

  getUserData() {
    return this.firebaseService.getUserData();
  }

  logOut() {
    this.firebaseService.logOut();
    this.router.navigateByUrl('/' + RouterConstantsService.ROUTER_HOME);
  }

  async updatePassword(password: string): Promise<boolean> {
    return await this.firebaseService.updatePassword(password);
  }

  async sendPasswordResetEmail(email: string): Promise<boolean> {
    return await this.firebaseService.sendPasswordResetEmail(email);
  }
}
