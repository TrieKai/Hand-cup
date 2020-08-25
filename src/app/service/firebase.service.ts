import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { MessageService } from 'src/app/service/message.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  signIn: boolean;
  authenticated: boolean;
  userLoggedIn = new Subject<boolean>();

  constructor(
    private afAuth: AngularFireAuth,
    private cons: ConstantsService,
    private message: MessageService,
  ) { }

  async signUp(email: string, password: string) {
    return await this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.sendEmailVerification();
        return true;
      })
      .catch((error) => {
        this.message.add({ type: this.cons.MESSAGE_TYPE.error, title: '註冊發生錯誤', content: error });
        return false;
      });
  }

  async sendEmailVerification() {
    await this.afAuth.auth.currentUser.sendEmailVerification()
      .then(() => {
        this.message.add({ type: this.cons.MESSAGE_TYPE.success, title: '通知', content: '驗證已寄送，請至信箱確認!' });
      })
      .catch((error) => {
        this.message.add({ type: this.cons.MESSAGE_TYPE.error, title: '驗證信箱發生錯誤', content: error });
      });
  }

  async login(email: string, password: string) {
    return await this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.message.add({ type: this.cons.MESSAGE_TYPE.success, title: '通知', content: '登錄成功' });
        return true;
      })
      .catch((error) => {
        this.message.add({ type: this.cons.MESSAGE_TYPE.error, title: '登錄發生錯誤', content: error });
        return false;
      });
  }

  logOut() {
    this.afAuth.auth.signOut()
      .then(() => {
        this.message.add({ type: this.cons.MESSAGE_TYPE.success, title: '通知', content: '已登出帳號' });
      })
      .catch((error) => {
        this.message.add({ type: this.cons.MESSAGE_TYPE.error, title: '登出發生錯誤', content: error });
      });
  }

  checkAuthStatus(): boolean {
    console.log('Firebase checkAuthStatus')
    firebase.auth().onAuthStateChanged((user) => {
      this.authenticated = !!user;
      this.userLoggedIn.next(this.authenticated);
    });

    return this.authenticated;
  }

  async checkTokenExpired(): Promise<boolean> {
    const now = new Date().toUTCString();
    let tokenExpired: boolean;
    await this.afAuth.auth.currentUser.getIdTokenResult()
      .then((result) => {
        const tokenExpirationTime = result.expirationTime;
        if (now > tokenExpirationTime) {
          tokenExpired = true;
          this.message.add({ type: this.cons.MESSAGE_TYPE.error, title: '', content: '登入逾期 請重新登入' });
        } else {
          tokenExpired = false;
        }
      });

    return tokenExpired;
  }

  getUserData(): firebase.User {
    return this.afAuth.auth.currentUser;
  }

  async updateProfile(profile: firebaseProfile) {
    await this.afAuth.auth.currentUser.updateProfile(profile)
      .then(() => {
        this.message.add({ type: this.cons.MESSAGE_TYPE.success, title: '通知', content: '更新個人資料成功' });
      })
      .catch((error) => {
        this.message.add({ type: this.cons.MESSAGE_TYPE.error, title: '更新個人資料失敗', content: error });
      });
  }
}