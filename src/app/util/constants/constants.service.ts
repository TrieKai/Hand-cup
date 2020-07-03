import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  public readonly GOOGLE_ICON_BASE_URL = 'http://maps.gstatic.com/consumer/images/icons/';

  // Status
  public readonly STATUS = {
    ok: 'OK',
    error: 'ERROR'
  };

  // Shared data
  public readonly SHAREDDATA = {
    onloading: 'onloading',
    showMap: 'showMap',
    drinkShopResults: 'drinkShopResults'
  };

  // message type
  public readonly MESSAGE_TYPE = {
    success: 'success',
    info: 'info',
    warn: 'warn',
    error: 'error'
  };

  constructor() { }
}
