import { Injectable, isDevMode } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { RouterConstantsService } from '../util/constants/router-constants.service';
import { FirebaseService } from 'src/app/service/firebase.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { MessageService } from 'src/app/service/message.service';
import { ApiConstantsService } from 'src/app/util/constants/api-constants.service';
import { ApiService } from 'src/app/util/api.service';
import { GlobalService as global } from 'src/app/service/global.service';
import { CookieService } from 'src/app/util/cookie.service';
import { LocalstorageService } from 'src/app/util/localstorage.service';

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
    private apiCons: ApiConstantsService,
    private api: ApiService,
    private cookie: CookieService,
    private localStorage: LocalstorageService,
  ) {
    firebaseService.checkAuthStatus();
  }

  checkUserLoggedIn(): Subject<boolean> {
    return this.firebaseService.userLoggedIn;
  }

  async loginFireBase(email: string, password: string): Promise<boolean> {
    return await this.firebaseService.login(email, password)
      .then((status) => {
        const user = this.firebaseService.getUserData();
        if (user && !user.emailVerified) {
          this.message.add({ type: this.cons.MESSAGE_TYPE.warn, title: '警告', content: '請去註冊信箱完成驗證!' });
        }
        return status;
      });
  }

  async login(thirdParty: boolean, password?: string) {
    const user = this.firebaseService.getUserData();
    const header: HttpHeaders = this.api.getHeader();
    const body: LoginReq = {
      userId: user.uid,
      email: user.email,
      password: thirdParty ? user.uid : password // 如果是第三方登入的話就沒有密碼, 以 uid 來代替密碼
    };
    const resp = await this.api.post(this.apiCons.LOGIN, body, header);
    if (isDevMode() || global.showLog) { console.log('login:', resp); }
    this.cookie.setCookie(this.cons.TOKEN, resp);

    const userPreferDate = await this.getUserPreferData();
    this.localStorage.updateLocalStorage(userPreferDate);
  }

  async signUpFireBase(email: string, password: string): Promise<boolean> {
    return await this.firebaseService.signUp(email, password);
  }

  async signUp(thirdParty: string, password?: string) {
    const user = this.firebaseService.getUserData();
    const header: HttpHeaders = this.api.getHeader();
    const body: SignUpReq = {
      userId: user.uid,
      name: thirdParty ? user.displayName : null,
      email: user.email,
      password: thirdParty ? user.uid : password, // 如果是第三方登入的話就沒有密碼, 以 uid 來代替密碼
      type: thirdParty
    };
    const resp = await this.api.post(this.apiCons.SIGNUP, body, header);
    if (isDevMode() || global.showLog) { console.log('signUp:', resp); }
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

  getFirebaseUserData() {
    return this.firebaseService.getUserData();
  }

  async getUserPreferData() {
    const user = this.firebaseService.getUserData();
    const favUrl = this.apiCons.FAVORITE_SHOP + '/' + user.uid;
    const visUrl = this.apiCons.VISITED_SHOP + '/' + user.uid;
    const header: HttpHeaders = this.api.getHeader();
    const favResp = await this.api.get(favUrl, null, header);
    if (isDevMode() || global.showLog) { console.log('get favorites:', favResp); }
    const visResp = await this.api.get(visUrl, null, header);
    if (isDevMode() || global.showLog) { console.log('get visited:', visResp); }
    return [favResp, visResp];
  }

  logOut() {
    this.firebaseService.logOut();
    this.cookie.deleteCookie(this.cons.TOKEN);
    this.router.navigateByUrl('/' + RouterConstantsService.ROUTER_HOME);
  }

  async updatePasswordFireBase(password: string): Promise<boolean> {
    return await this.firebaseService.updatePassword(password);
  }

  async updatePassword(password: string) {
    const user = this.firebaseService.getUserData();
    const url = this.apiCons.UPDATE + '/' + user.uid;
    const body: PasswordUpdateReq = {
      password: password
    };
    const token = this.cookie.getCookie(this.cons.TOKEN);
    const header: HttpHeaders = this.api.getHeader(token);
    const resp = await this.api.put(url, body, header);
    if (isDevMode() || global.showLog) { console.log('password update:', resp); }
  }

  async resendEmail() {
    await this.firebaseService.sendEmailVerification();
  }

  async sendPasswordResetEmail(email: string): Promise<boolean> {
    return await this.firebaseService.sendPasswordResetEmail(email);
  }

  async resetPassword(email: string, password: string, key: string) {
    const url = this.apiCons.RESET;
    const body: ResetPasswordReq = {
      email: email,
      password: password,
      key: key
    };
    const header: HttpHeaders = this.api.getHeader();
    const resp = await this.api.post(url, body, header);
    if (isDevMode() || global.showLog) { console.log('password reset:', resp); }
  }
}
