import { Injectable } from '@angular/core';

const domain = 'localhost';
const port = ':5487';
const pre_url = domain + port;

@Injectable({
  providedIn: 'root'
})
export class ApiConstantsService {
  // map
  public readonly GET_NEARBY_SEARCH = pre_url + '/map';

  constructor() { }
}
