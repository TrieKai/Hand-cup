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
    userData: 'userData',
    showMap: 'showMap',
    imageOnload: 'imageOnload',
    outputCanvas: 'outputCanvas',
    drinkShopResults: 'drinkShopResults',
    loginComponentRef: 'loginComponentRef',
    profileComponentRef: 'profileComponentRef',
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

  // Local storage
  public readonly LOCAL_STORAGE_TYPE = {
    favorite: 'favorite',
    haveBeen: 'haveBeen'
  }

  // Upload target
  public readonly UPLOAD_TARGET_TYPE = {
    profile: 'profile'
  }

  // Upload resource key
  public readonly UPLOAD_RESOURCE_KEY = 'file';

  constructor() { }
}
