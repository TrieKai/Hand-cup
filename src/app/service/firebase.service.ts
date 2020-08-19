import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { MessageService } from 'src/app/service/message.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private afAuth: AngularFireAuth,
    private cons: ConstantsService,
    private message: MessageService,
  ) { }

  async signUp(email: string, password: string) {
    const result = await this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.sendEmailVerification();
      })
      .catch((error) => {
        this.message.add({ type: this.cons.MESSAGE_TYPE.error, title: '註冊發生錯誤', content: error });
      });
    return result;
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
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.message.add({ type: this.cons.MESSAGE_TYPE.success, title: '通知', content: '登錄成功' });
      })
      .catch((error) => {
        this.message.add({ type: this.cons.MESSAGE_TYPE.error, title: '登錄發生錯誤', content: error });
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

  // async getUserData(): Promise<firebase.User> {
  //   let userData: firebase.User = null;
  //   this.afAuth.auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       userData = user;
  //       console.log('User is signed in')
  //       return user;
  //     } else {
  //       return;
  //     }
  //   });
  //   return userData;
  // }

  getUserData(): firebase.User {
    return this.afAuth.auth.currentUser;
  }
}