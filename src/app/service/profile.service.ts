import { Injectable } from '@angular/core';

import { FirebaseService } from 'src/app/service/firebase.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private firebaseService: FirebaseService,
    private sharedService: SharedService,
    private cons: ConstantsService,
  ) { }

  getUserData(): firebase.User {
    return this.firebaseService.getUserData();
  }

  async updateProfile(userData: firebaseProfile) {
    await this.firebaseService.checkTokenExpired()
      .then(async (tokenExpired) => {
        console.log('tokenExpired: ', tokenExpired)
        if (!tokenExpired) {
          if (this.firebaseService.checkAuthStatus()) {
            console.log('===updateProfile===')
            await this.firebaseService.updateProfile(userData);
            const updatedUserData = this.firebaseService.getUserData();
            this.sharedService.setSharedData(this.cons.SHAREDDATA.userData, updatedUserData);
          }
        }
      });
  }
}
