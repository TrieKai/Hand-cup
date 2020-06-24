import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrinkShopService {
  sharedData: drinkShopSharedData = { showMap: null, drinkShopResults: null };

  constructor() { }

  setSharedData(key: string, value: any) {
    if (!this.getSharedData(key)) {
      this.sharedData[key] = value;
    }
    return this.sharedData[key];
  }

  getSharedData(key: string) {
    return this.sharedData[key];
  }

  // setShowMap(flag: boolean): void {
  //   this.showMap = flag;
  // }

  // getShowMap(): boolean {
  //   return this.showMap;
  // }

  getTopLocation(locataion: Coordinate, dataList: drinkShopResults[], number: number): any {
    console.log(locataion.latitude, locataion.longitude)
    const resp = dataList.map((data) => {
      const distanceGap = Math.abs(locataion.latitude - data.latitude) + Math.abs(locataion.longitude - data.longitude); // 距離差
      return {
        ...data,
        distanceGap: distanceGap
      }
    }).sort((a, b) => {
      return a.distanceGap - b.distanceGap; // 升冪
    }).slice(0, number); // 取前幾名

    return resp;
  }
}
