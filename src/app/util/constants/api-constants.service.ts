import { Injectable } from '@angular/core';

// const domain = 'localhost';
// const port = ':5487';
// const pre_url = domain + port;
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

  constructor() { }
}
