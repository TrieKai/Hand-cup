import { Injectable } from '@angular/core';

// const domain = 'localhost';
// const port = ':5487';
// const pre_url = domain + port;
const pre_url = 'http://handcupbackend-env.eba-v8esebru.ap-southeast-1.elasticbeanstalk.com';
@Injectable({
  providedIn: 'root'
})
export class ApiConstantsService {
  // map
  public readonly GET_NEARBY_SEARCH = pre_url + '/map';

  constructor() { }
}
