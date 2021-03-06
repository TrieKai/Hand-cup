import { Injectable, isDevMode } from '@angular/core';

import { ApiConstantsService } from 'src/app/util/constants/api-constants.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { ApiService } from 'src/app/util/api.service';
import { GlobalService as global } from '../service/global.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    private apiCons: ApiConstantsService,
    private cons: ConstantsService,
    private api: ApiService,
  ) { }

  async uploadFile(targetType: string, file: File, token?: string): Promise<RespData> {
    const param = {
      targetType: targetType
    };
    const formData: FormData = new FormData();
    formData.append(this.cons.UPLOAD_RESOURCE_KEY, file);
    // TODO: Authorization
    // const authorization = { key: 'Authorization', value: `Bearer ${token}` };
    // const header = this.api.getHeader([authorization]);
    // Do not use headers.append('Content-Type', 'multipart/form-data');
    const resp: RespData = await this.api.postFile(this.apiCons.UPLOAD_FILE, formData, param, null);
    if (isDevMode() || global.showLog) {
      console.log('uploadResource:', resp);
    }
    return resp;
  }
}
