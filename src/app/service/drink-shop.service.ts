import { Injectable } from '@angular/core';

import { ConstantsService } from 'src/app/util/constants/constants.service';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
    providedIn: 'root'
})
export class DrinkShopService {
    sharedData: drinkShopSharedData = { onloading: false, showMap: true, drinkShopResults: null };
    currentCoordinate: Coordinate = { latitude: null, longitude: null };

    constructor(
        private cons: ConstantsService,
        private sharedService: SharedService,
    ) { }

    setSharedData(key: string, value: any) {
        console.log('setSharedData:', key, value)
        if (this.hasKey(key)) {
            this.sharedData[key] = value;
            this.sharedService.onInitEmit();
            return this.sharedData[key];
        } else {
            return null;
        }
    }

    getSharedData(key: string) {
        return this.sharedData[key];
    }

    hasKey(key: string) {
        return this.sharedData.hasOwnProperty(key);
    }

    getTopLocation(locataion: Coordinate, dataList: drinkShopResults[], number: number): any {
        if (dataList.length === 0) { return; }
        console.log('latitude:', locataion.latitude, 'longitude:', locataion.longitude, 'dataList:', dataList)
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

        console.log(fullStars, halfStars, emptyStars)
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
