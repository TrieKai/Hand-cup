import { Injectable, isDevMode } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { FirebaseService } from 'src/app/service/firebase.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { ApiConstantsService } from 'src/app/util/constants/api-constants.service';
import { ApiService } from 'src/app/util/api.service';
import { CookieService } from 'src/app/util/cookie.service';
import { GlobalService as global } from 'src/app/service/global.service';
import { CommonService } from 'src/app/service/common.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private firebaseService: FirebaseService,
    private sharedService: SharedService,
    private cons: ConstantsService,
    private apiCons: ApiConstantsService,
    private api: ApiService,
    private cookie: CookieService,
    private common: CommonService,
  ) { }

  getUserData(): firebase.User {
    return this.firebaseService.getUserData();
  }

  async updateProfileFireBase(userData: firebaseProfile) {
    await this.firebaseService.checkTokenExpired()
      .then(async (tokenExpired) => {
        console.log('tokenExpired: ', tokenExpired)
        if (!tokenExpired) {
          if (this.firebaseService.checkAuthStatus()) {
            console.log('===== updateProfile =====')
            await this.firebaseService.updateProfile(userData);
            const updatedUserData = this.firebaseService.getUserData();
            this.sharedService.setSharedData(this.cons.SHAREDDATA.userData, updatedUserData);
          }
        }
      });
  }

  async updateProfile(name: string) {
    const user = this.firebaseService.getUserData();
    const url = this.apiCons.UPDATE + '/' + user.uid;
    const body: UserUpdateReq = { name: name };
    const token = this.cookie.getCookie(this.cons.TOKEN);

    return new Promise(async (res, rej) => {
      if (this.common.checkTokenValid(token)) {
        const header: HttpHeaders = this.api.getHeader(token);
        const resp: RespData = await this.api.put(url, body, header);
        if (isDevMode() || global.showLog) {
          console.log('user update:', resp);
        }
        if (this.common.checkAPIResp(resp)) {
          res(resp.body.data);
        } else {
          rej();
        }
      } else {
        rej();
      }
    });
  }
}
