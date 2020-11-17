import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuConstantsService {
  // Home
  public readonly HOME: string = "波吧飲料地圖";

  public readonly HOME_ICON: string = "../../assets/img/Logo.png";

  // Menu
  public readonly DRINK: string = "今天飲料喝什麼?";
  public readonly DRINK_SHOP: string = "今天飲料喝哪家?";
  public readonly COMPARE: string = "比較模式";
  public readonly RECOMMENDATION: string = "客製化推薦";
  public readonly COLLECTION: string = "我的地圖";
  public readonly NEWEST: string = "What's new!";

  public readonly DRINK_ICON: string = "../../assets/img/Icon-What kinda drink.png";
  public readonly DRINK_SHOP_ICON: string = "../../assets/img/Icon-Which shop.png";
  public readonly COMPARE_ICON: string = "../../assets/img/Icon-Comparison.png";
  public readonly RECOMMENDATION_ICON: string = "../../assets/img/Icon-Recommendation.png";
  public readonly COLLECTION_ICON: string = "../../assets/img/Icon-Saved.png";
  public readonly NEWEST_ICON: string = "../../assets/img/Icon-New.png";

  // UtilitiesMenu
  // public readonly LOGIN: string = "登入";
  // public readonly LOGOUT: string = "登出";
  // public readonly SETTING: string = "設定";
  // public readonly REPORT: string = "回報區";

  // public readonly LOGIN_ICON: string = "login";
  // public readonly LOGOUT_ICON: string = "logout";
  // public readonly SETTING_ICON: string = "apps";
  // public readonly REPORT_ICON: string = "apps";

  constructor() { }
}
