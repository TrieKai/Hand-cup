import { Injectable, isDevMode } from '@angular/core';

import { ApiConstantsService } from 'src/app/util/constants/api-constants.service';
import { ApiService } from 'src/app/util/api.service';
import { GlobalService as global } from 'src/app/service/global.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    private apiCons: ApiConstantsService,
    private api: ApiService,
  ) { }

  async uploadFile(targetType: string, file: File, token?: string) {
    const param = {
      targetType: targetType
    };
    const formData: FormData = new FormData();
    // formData.append(this.cons.UPLOAD_RESOURCE_KEY.file, file);
    formData.append('file', file);
    // const authorization = { key: 'Authorization', value: `Bearer ${token}` };
    // const header = this.api.getHeader([authorization]);
    const header = this.api.getHeader();
    const resp = await this.api.postFile(this.apiCons.UPLOAD_FILE, formData, param, header);
    if (isDevMode() || global.showLog) { console.log('uploadResource:', resp); }
    return resp;
  }
}
