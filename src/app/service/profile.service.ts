import { Injectable } from '@angular/core';

import { FirebaseService } from 'src/app/service/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private firebaseService: FirebaseService
  ) { }

  async updateProfile(userData: firebaseProfile) {
    await this.firebaseService.checkTokenExpired()
      .then((tokenExpired) => {
        console.log('tokenExpired: ', tokenExpired)
        if (!tokenExpired) {
          if (this.firebaseService.checkAuthStatus()) {
            console.log('updateProfile: ', this.firebaseService.getUserData())
            this.firebaseService.updateProfile(userData);
          }
        }
      });
  }
}
