import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiConstantsService {
  // common
  public readonly LOGIN = environment.url + '/login';
  public readonly SIGNUP = environment.url + '/signup';
  public readonly UPDATE = environment.url + '/users';
  public readonly RESET = environment.url + '/reset';
  public readonly UPLOAD_FILE = environment.url + '/upload';

  // map
  public readonly GET_NEARBY_SEARCH = environment.url + '/map';
  public readonly GET_PLACE_DETAIL = environment.url + '/map/';
  public readonly FAVORITE_SHOP = environment.url + '/favorites';
  public readonly VISITED_SHOP = environment.url + '/visited';
  public readonly GET_MYMAP = environment.url + '/myMap/';

  // Result
  public readonly API_RESULT_SUCCESS: string = 'success';
  public readonly API_RESULT_ERROR: string = 'error';

  constructor() { }
}
