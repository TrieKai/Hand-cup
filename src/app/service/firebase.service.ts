import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { AngularFireAuth } from "@angular/fire/auth";
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { MessageService } from 'src/app/service/message.service';
import { SharedService } from 'src/app/shared/shared.service';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  signIn: boolean;
  authenticated: boolean;
  userLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private afAuth: AngularFireAuth,
    private cons: ConstantsService,
    private message: MessageService,
    private sharedService: SharedService,
  ) { }

  async signUp(email: string, password: string): Promise<boolean> {
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

  async signUpWithGoogle(): Promise<boolean> {
    const provider = new firebase.auth.GoogleAuthProvider;
    return this.afAuth.auth.signInWithPopup(provider)
      .then((result) => {
        console.log(result)
        return true;
      })
      .catch((error) => {
        this.message.add({ type: this.cons.MESSAGE_TYPE.error, title: 'Google驗證發生錯誤', content: error });
        return false;
      });
  }

  async signUpWithFacebook(): Promise<boolean> {
    const provider = new firebase.auth.FacebookAuthProvider;
    return this.afAuth.auth.signInWithPopup(provider)
      .then((result) => {
        console.log(result)
        return true;
      })
      .catch((error) => {
        this.message.add({ type: this.cons.MESSAGE_TYPE.error, title: 'Facebook驗證發生錯誤', content: error });
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

  async verifyEmail(oobCode: string): Promise<(boolean | any)[]> {
    return await this.afAuth.auth.applyActionCode(oobCode)
      .then(() => {
        this.afAuth.auth.currentUser.emailVerified = true;
        return [true, null];
      })
      .catch((error) => {
        this.message.add({ type: this.cons.MESSAGE_TYPE.error, title: '驗證信箱發生錯誤', content: error });
        return [false, error];
      });
  }

  async login(email: string, password: string): Promise<boolean> {
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

  async reAuth(email: string, password: string): Promise<boolean> {
    const credential = firebase.auth.EmailAuthProvider.credential(email, password)
    return await this.afAuth.auth.currentUser.reauthenticateWithCredential(credential)
      .then(() => {
        this.message.add({ type: this.cons.MESSAGE_TYPE.success, title: '通知', content: '驗證成功' });
        return true;
      })
      .catch((error) => {
        this.message.add({ type: this.cons.MESSAGE_TYPE.error, title: '驗證發生錯誤', content: error });
        return false;
      });
  }

  checkAuthStatus(): boolean {
    this.afAuth.auth.onAuthStateChanged((user) => {
      console.log('=== Firebase checkAuthStatus ===')
      this.authenticated = !!user;
      this.userLoggedIn.next(this.authenticated);
      this.sharedService.setSharedData(this.cons.SHAREDDATA.userData, user); // For user photo
    });

    return this.authenticated;
  }

  test(){
    return this.afAuth.auth.onAuthStateChanged;
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

  async updatePassword(password: string): Promise<boolean> {
    return await this.afAuth.auth.currentUser.updatePassword(password)
      .then(() => {
        this.message.add({ type: this.cons.MESSAGE_TYPE.success, title: '通知', content: '更新密碼成功' });
        return true;
      })
      .catch((error) => {
        this.message.add({ type: this.cons.MESSAGE_TYPE.error, title: '更新密碼失敗', content: error });
        return false;
      });
  }

  async sendPasswordResetEmail(email: string): Promise<boolean> {
    return await this.afAuth.auth.sendPasswordResetEmail(email)
      .then(() => {
        this.message.add({ type: this.cons.MESSAGE_TYPE.success, title: '通知', content: '重設密碼信件已發送!' });
        return true;
      })
      .catch((error) => {
        this.message.add({ type: this.cons.MESSAGE_TYPE.error, title: '重設密碼信件發送失敗', content: error });
        return false;
      });
  }

  async resetPassword(oobCode: string): Promise<(boolean | string | any)[]> {
    return await this.afAuth.auth.verifyPasswordResetCode(oobCode)
      .then((email) => {
        return [true, email];
      })
      .catch((error) => {
        this.message.add({ type: this.cons.MESSAGE_TYPE.error, title: '重設密碼發生錯誤', content: error });
        return [false, error];
      });
  }
}