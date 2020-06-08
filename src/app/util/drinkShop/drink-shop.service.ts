import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrinkShopService {

  constructor() { }

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
