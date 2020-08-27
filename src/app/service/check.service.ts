import { Injectable } from '@angular/core';

import { ApiConstantsService } from 'src/app/util/constants/api-constants.service';

@Injectable({
  providedIn: 'root'
})
export class CheckService {

  constructor(
    private apiCons: ApiConstantsService
  ) { }

  // apiResult(resp: any, errorAlert?: boolean, errorMsg?: string): boolean {
  //   if (!(resp instanceof Array) && !(resp instanceof Object)) {
  //     return false;
  //   }
  //   let tempResp: ReturnStatus = resp;
  //   while (tempResp) {
  //     if (tempResp instanceof Array) {
  //       tempResp = tempResp[0];
  //     } else if (tempResp instanceof Object) {
  //       if (tempResp.error) { return false; }
  //       if (tempResp.returnStatus) {
  //         return this.returnStatusHandler(tempResp.returnStatus, errorAlert);
  //       } else if (tempResp.msg instanceof Array && tempResp.msg[0] && tempResp.msg[0].returnStatus) {
  //         return this.returnStatusHandler(tempResp.msg[0].returnStatus, errorAlert, errorMsg);
  //       }
  //       const key = Object.keys(tempResp)[0];
  //       if (!key) { break; }
  //       tempResp = tempResp[key];
  //     } else {
  //       break;
  //     }
  //   }
  //   return true;
  // }

  // private returnStatusHandler(status: string, errorAlert?: boolean, errorMsg?: string): boolean {
  //   switch (status) {
  //     case this.apiCons.API_RESULT_SUCCESS:
  //       return true;
  //   }
  //   return false;
  // }

  apiResult(resp: any) {
    // TODO: Finish check api result
    if (resp instanceof ProgressEvent) {
      return false;
    }
    // if (!(resp instanceof Array) && !(resp instanceof Object)) {
    //   return false;
    // }
    // if (resp.hasOwnProperty('type') && resp.type === this.apiCons.API_RESULT_ERROR) {
    //   return false;
    // }
    return true;
  }
}
