import { Injectable } from '@angular/core';

import { FirebaseService } from 'src/app/service/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private firebaseService: FirebaseService
  ) { }

  updateProfile(userData: firebaseProfile) {
    if (this.firebaseService.getUserData()) {
      this.firebaseService.updateProfile(userData);
    }
  }
}
