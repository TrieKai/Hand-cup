import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  // Google icon preUrl
  public readonly GOOGLE_ICON_BASE_URL = 'http://maps.gstatic.com/consumer/images/icons/';

  // Status
  public readonly STATUS = {
    success: 'success',
    error: 'error'
  };

  // Direction
  public readonly DIRECTION = {
    top: 'top',
    right: 'right',
    bottom: 'bottom',
    left: 'left'
  };

  // Shared component
  public readonly SHAREDCOMPONENT = {
    loginComponentRef: 'loginComponentRef',
    profileComponentRef: 'profileComponentRef',
    reAuthComponentRef: 'reAuthComponentRef',
    forgotPasswordComponentRef: 'forgotPasswordComponentRef',
    lockScreenComponentRef: 'lockScreenComponentRef',
    reviewComponentRef: 'reviewComponentRef',
    confirmComponentRef: 'confirmComponentRef',
  };

  // Shared data
  public readonly SHAREDDATA = {
    userData: 'userData',
    drinkShopResults: 'drinkShopResults',
  };

  // Shared HTML data
  public readonly HTMLSHAREDDATA = {
    searchInputRef: 'searchInputRef',
  };

  // Shared status
  public readonly SHAREDSTATUS = {
    onloading: 'onloading',
    lockScreen: 'lockScreen',
    showMap: 'showMap',
    isConfirm: 'isConfirm',
  };

  // Message type
  public readonly MESSAGE_TYPE = {
    success: 'success',
    info: 'info',
    warn: 'warn',
    error: 'error'
  };

  // Confrim text
  public readonly CONFIRM_TEXT = {
    confirm: '確認',
    cancel: '取消',
  };

  // Third party type
  public readonly SIGNUP_TYPE = {
    email: 'email',
    google: 'google',
    facebook: 'facebook',
  };

  public readonly VALIDATE_MESSAGE = {
    emailFormat: '信箱格式錯誤',
    passwordFormat: '密碼格式錯誤',
    passwordLength: '密碼至少六位數',
  };

  // Info message
  public readonly INFO_MESSAGE = {
    drinks: '今天飲料喝甚麼?',
    drinkShops: '今天飲料喝哪家?',
    myMap: '我的地圖',
    emailVerify: '信箱驗證',
    resetPassword: '重設密碼',
  };

  // Token
  public readonly TOKEN = 'token';

  // API response message
  public readonly API_ERROR: string = '連線回應錯誤';
  public readonly API_STATUS_FORMAT_ERROR: string = '連線狀態錯誤';

  // Local storage
  public readonly LOCAL_STORAGE_TYPE = {
    favorite: 'favorite',
    visited: 'visited'
  };

  // Upload target
  public readonly UPLOAD_TARGET_TYPE = {
    profile: 'profile'
  };

  // Upload resource key
  public readonly UPLOAD_RESOURCE_KEY = 'file';

  constructor() { }
}
