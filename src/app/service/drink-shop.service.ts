import { Injectable, isDevMode } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { ApiService } from 'src/app/util/api.service';
import { ApiConstantsService } from 'src/app/util/constants/api-constants.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { CommonService } from 'src/app/service/common.service';

import { GlobalService as global } from '../service/global.service';

@Injectable({
  providedIn: 'root'
})
export class DrinkShopService {
  currentCoordinate: Coordinate = { latitude: null, longitude: null };

  constructor(
    private api: ApiService,
    private apiCons: ApiConstantsService,
    private cons: ConstantsService,
    private common: CommonService,
  ) { }

  async getPlaceDetail(placeId: string): Promise<drinkShopDetail> {
    const header: HttpHeaders = this.api.getHeader();
    const resp: RespData = await this.api.get(`${this.apiCons.GET_PLACE_DETAIL + placeId}/${this.cons.LANGUAGE.zh}`, null, header);
    if (isDevMode() || global.showLog) {
      console.log(resp);
    }
    if (this.common.checkAPIResp(resp)) {
      return resp.body.data;
    } else {
      return null;
    }
  }

  getTopLocation(locataion: Coordinate, dataList: drinkShopResults[], number?: number): any[] {
    if (dataList.length === 0) { return []; }
    if (isDevMode() || global.showLog) {
      console.log('latitude:', locataion.latitude, 'longitude:', locataion.longitude, 'dataList:', dataList)
    }
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

  handleRatingStar(rating: number) {
    const ratings: number = rating * 10 + 2; // 加二是因為好計算
    const ratingStars: number = Math.floor(ratings / 5) / 2; // 標準化成得到的星星數
    const fullStars: number = Math.floor(ratingStars); // 滿星的數量
    const halfStars: number = (ratingStars - fullStars) * 2; // 半星的數量
    const emptyStars: number = 5 - fullStars - halfStars; // 空星的數量
    let starContent: string = '';

    if (rating === 0) {
      starContent = '尚未有評分';
      return starContent;
    } else {
      for (let i: number = 0; i < fullStars; i++) {
        starContent = starContent + '<li class="ratingStar" style="background-image: url(' + this.cons.GOOGLE_ICON_BASE_URL + '2x/ic_star_rate_14.png);"></li>';
      }
      if (halfStars) {
        starContent = starContent + '<li class="ratingStar" style="background-image: url(' + this.cons.GOOGLE_ICON_BASE_URL + '2x/ic_star_rate_half_14.png);"></li>';
      }
      if (emptyStars) {
        for (let i: number = 0; i < emptyStars; i++) {
          starContent = starContent + '<li class="ratingStar" style="background-image: url(' + this.cons.GOOGLE_ICON_BASE_URL + '2x/ic_star_rate_empty_14.png);"></li>';
        }
      }
      return starContent;
    }
  }

  async getFavoriteShop(userId: string): Promise<any[]> {
    const url = this.apiCons.FAVORITE_SHOP + '/' + userId;
    const header: HttpHeaders = this.api.getHeader();
    const resp: RespData = await this.api.get(url, null, header);
    if (isDevMode() || global.showLog) {
      console.log(resp);
    }
    if (this.common.checkAPIResp(resp)) {
      return resp.body.data;
    } else {
      return null;
    }
  }

  async favoriteShop(status: boolean, placeId: string, userId: string): Promise<boolean> {
    if (status) {
      const header: HttpHeaders = this.api.getHeader();
      const body: favoriteReq = {
        placeId: placeId,
        userId: userId
      };
      const resp: RespData = await this.api.post(this.apiCons.FAVORITE_SHOP, body, header);
      if (isDevMode() || global.showLog) {
        console.log(resp);
      }
      return this.common.checkAPIStatus(resp);
    } else {
      const url = this.apiCons.FAVORITE_SHOP + '/' + userId + '/' + placeId;
      const header: HttpHeaders = this.api.getHeader();
      const resp: RespData = await this.api.delete(url, null, header);
      if (isDevMode() || global.showLog) {
        console.log(resp);
      }
      return this.common.checkAPIStatus(resp);
    }
  }

  async getVisitedShop(userId: string): Promise<any[]> {
    const url = this.apiCons.VISITED_SHOP + '/' + userId;
    const header: HttpHeaders = this.api.getHeader();
    const resp: RespData = await this.api.get(url, null, header);
    if (isDevMode() || global.showLog) {
      console.log(resp);
    }
    if (this.common.checkAPIResp(resp)) {
      return resp.body.data;
    } else {
      return null;
    }
  }

  async visitedShop(status: boolean, placeId: string, userId: string): Promise<boolean> {
    if (status) {
      const header: HttpHeaders = this.api.getHeader();
      const body: visitedReq = {
        placeId: placeId,
        userId: userId
      };
      const resp: RespData = await this.api.post(this.apiCons.VISITED_SHOP, body, header);
      if (isDevMode() || global.showLog) {
        console.log(resp);
      }
      return this.common.checkAPIStatus(resp);
    } else {
      const url = this.apiCons.VISITED_SHOP + '/' + userId + '/' + placeId;
      const header: HttpHeaders = this.api.getHeader();
      const resp: RespData = await this.api.delete(url, null, header);
      if (isDevMode() || global.showLog) {
        console.log(resp);
      }
      return this.common.checkAPIStatus(resp);
    }
  }
}
