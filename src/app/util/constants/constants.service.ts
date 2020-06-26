import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  public readonly STATUS = {
    ok: 'OK',
    error: 'ERROR',
  };

  public readonly GOOGLE_ICON_BASE_URL = 'http://maps.gstatic.com/consumer/images/icons/';

  public readonly SHAREDDATA_ONLOADING = 'onloading';
  public readonly SHAREDDATA_SHOWMAP = 'showMap';
  public readonly SHAREDDATA_DRINKSHOPRESULTS = 'drinkShopResults';

  constructor() { }
}
