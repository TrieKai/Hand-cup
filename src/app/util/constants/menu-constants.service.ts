import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuConstantsService {
  public readonly DRINK: string = "今天飲料喝什麼?";
  public readonly DRINK_SHOP: string = "今天飲料喝哪家?";
  public readonly COMPARE: string = "比較樣式";
  public readonly RECOMMENDATION: string = "客製化推薦";
  public readonly COLLECTION: string = "我的收藏";
  public readonly NEWEST: string = "What's new!";

  public readonly DRINK_ICON: string = 'folder';
  public readonly DRINK_SHOP_ICON: string = "folder";
  public readonly COMPARE_ICON: string = "folder";
  public readonly RECOMMENDATION_ICON: string = "folder";
  public readonly COLLECTION_ICON: string = "folder";
  public readonly NEWEST_ICON: string = "folder";

  constructor() { }
}
