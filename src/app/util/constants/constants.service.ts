import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  // Google icon preUrl
  public readonly GOOGLE_ICON_BASE_URL = 'http://maps.gstatic.com/consumer/images/icons/';

  // Status
  public readonly STATUS = {
    ok: 'OK',
    error: 'ERROR'
  };

  // Shared data
  public readonly SHAREDDATA = {
    userData: 'userData',
    drinkShopResults: 'drinkShopResults',
    loginComponentRef: 'loginComponentRef',
    profileComponentRef: 'profileComponentRef',
    reAuthComponentRef: 'reAuthComponentRef',
    forgotPasswordComponentRef: 'forgotPasswordComponentRef',
    lockScreenComponentRef: 'lockScreenComponentRef',
  };

  public readonly SHAREDSTATUS = {
    onloading: 'onloading',
    lockScreen: 'lockScreen',
    showMap: 'showMap',
  };

  // HTML Shared data
  public readonly HTMLSHAREDDATA = {
    searchInputRef: 'searchInputRef',
  };

  // Message type
  public readonly MESSAGE_TYPE = {
    success: 'success',
    info: 'info',
    warn: 'warn',
    error: 'error'
  };

  // Third party type
  public readonly THIRD_PARTY_TYPE = {
    google: 'google',
    facebook: 'facebook'
  };

  // Info message
  public readonly INFO_MESSAGE = {
    drinks: '今天飲料喝甚麼?',
    drinkShops: '今天飲料喝哪家?',
    emailVerify: '信箱驗證',
    resetPassword: '重設密碼',
  }

  // Token
  public readonly TOKEN = 'token';

  // Local storage
  public readonly LOCAL_STORAGE_TYPE = {
    favorite: 'favorite',
    visited: 'visited'
  }

  // Upload target
  public readonly UPLOAD_TARGET_TYPE = {
    profile: 'profile'
  }

  // Upload resource key
  public readonly UPLOAD_RESOURCE_KEY = 'file';

  constructor() { }
}
