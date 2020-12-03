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

  // Drinks
  public readonly DRINKS: drinksData[] = [
    {
      name: '原茶系列', image: 'assets/img/drinks/茗茶.png',
      subDrinks: [{ name: '高山青茶' }, { name: '大吉嶺紅茶' }, { name: '東方美人茶' }, { name: '鐵觀音' }, { name: '阿薩姆紅茶' }, { name: '伯爵紅茶' }, { name: '烏龍茶' }, { name: '日月潭紅茶' }, { name: '玄米茶' }, { name: '蕎麥茶' }]
    },
    {
      name: '奶茶系列', image: 'assets/img/drinks/奶茶.png',
      subDrinks: [{ name: '烏龍(鮮)奶茶' }, { name: '綠(鮮)奶茶' }, { name: '(鮮)奶茶' }, { name: '鐵觀音(鮮)奶茶' }, { name: '芋香(鮮)奶茶' }, { name: '可可(鮮)奶茶' }, { name: '白蘭地(鮮)奶茶' }, { name: '胚芽(鮮)奶茶' }]
    },
    {
      name: '果茶系列', image: 'assets/img/drinks/果醋.png',
      subDrinks: [{ name: '檸檬紅茶' }, { name: '葡萄柚綠茶' }, { name: '芒果青茶' }, { name: '蔓越莓綠茶' }, { name: '百香果綠' }]
    },
    {
      name: '果汁系列', image: 'assets/img/drinks/鮮果.png',
      subDrinks: [{ name: '木瓜牛乳' }, { name: '芭樂汁' }, { name: '檸檬汁' }, { name: '金桔檸檬' }, { name: '葡萄柚汁' }]
    },
    {
      name: '花草茶系列', image: 'assets/img/drinks/熱飲.png',
      subDrinks: [{ name: '洛神花茶' }, { name: '玫瑰花茶' }, { name: '迷迭香茶' }, { name: '薰衣草茶' }, { name: '桂花茶' }, { name: '菊花茶' }, { name: '薄荷葉茶' }, { name: '馬鞭草茶' }, { name: '洛神' }, { name: '檸檬草茶' }]
    },
    {
      name: '特調系列', image: 'assets/img/drinks/特調.png',
      subDrinks: [{ name: '蜂蜜紅茶' }, { name: '蜂蜜綠茶' }, { name: '蜂蜜露' }, { name: '多多綠' }, { name: '檸檬多多' }, { name: '冬瓜檸檬' }, { name: '港式凍檸茶' }, { name: '冬瓜青茶' }, { name: '冬瓜茶' }, { name: '芒果多多' }]
    },
    {
      name: '鮮奶系列', image: 'assets/img/drinks/優多.png',
      subDrinks: [{ name: '芋頭鮮奶' }, { name: '珍珠鮮奶' }, { name: '冬瓜鮮奶' }, { name: '蜂蜜鮮奶' }]
    }
  ];

  constructor() { }
}
