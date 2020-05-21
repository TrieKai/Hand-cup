import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrinkShopService {

  constructor() { }

  getTopLocation(locataion: Coordinate, dataList: any, number: number): any {
    const resp = dataList.map((data) => {
      const distanceGap = (locataion.latitude - data.longitude) + (locataion.longitude - data.latitute); // 距離差
      return {
        ...data,
        distanceGap: distanceGap
      }
    }).sort((a, b) => {
      return a - b; // 升冪
    }).slice(0, number); // 取前幾名

    return resp;
  }
}
