import { Injectable } from '@angular/core';

const dev_url = 'http://bobamaps.ap-southeast-1.elasticbeanstalk.com';
const uat_url = 'https://api.bobamaps.site';

@Injectable({
  providedIn: 'root'
})
export class ApiConstantsService {
  // map
  // public readonly GET_NEARBY_SEARCH = dev_url + '/map';
  public readonly GET_NEARBY_SEARCH = uat_url + '/map';
  // public readonly GET_PLACE_DETAIL = dev_url + '/map/';
  public readonly GET_PLACE_DETAIL = uat_url + '/map/';
  // public readonly UPLOAD_FILE = dev_url + '/upload';
  public readonly UPLOAD_FILE = uat_url + '/upload';

  public readonly API_RESULT_SUCCESS: string = 'success';
  public readonly API_RESULT_ERROR: string = 'error';

  constructor() { }
}
