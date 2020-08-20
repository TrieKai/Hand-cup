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
    loginComponentRef: 'loginComponentRef',
    profileComponentRef: 'profileComponentRef',
    showMap: 'showMap',
    drinkShopResults: 'drinkShopResults'
  };

  // Message type
  public readonly MESSAGE_TYPE = {
    success: 'success',
    info: 'info',
    warn: 'warn',
    error: 'error'
  };

  // Info message
  public readonly INFO_MESSAGE = {
    drinks: '今天飲料喝甚麼?',
    drinkShops: '今天飲料喝哪家?'
  }

  public readonly LOCAL_STORAGE_TYPE = {
    favorite: 'favorite',
    haveBeen: 'haveBeen'
  }

  constructor() { }
}
