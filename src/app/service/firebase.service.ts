import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private afAuth: AngularFireAuth,
  ) { }

  async register(email: string, password: string) {
    const result = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    console.log(result)
    this.sendEmailVerification();
  }

  async sendEmailVerification() {
    await this.afAuth.auth.currentUser.sendEmailVerification()
      .then(() => {
        alert('已發送EMAIL');
      })
      .catch((error) => {
        alert(error)
      });
  }
}
