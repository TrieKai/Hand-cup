import { Injectable, isDevMode } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { ApiService } from 'src/app/util/api.service';
import { ApiConstantsService } from 'src/app/util/constants/api-constants.service';
import { GlobalService as global } from 'src/app/service/global.service';
import { CommonService } from 'src/app/service/common.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(
    private api: ApiService,
    private apiCons: ApiConstantsService,
    private common: CommonService,
  ) { }

  // async getNearByLocationsByFrontend(map: google.maps.Map, request: object, callBackFunc: any): Promise<void> {
  //   const placesService = new google.maps.places.PlacesService(map);
  //   placesService.nearbySearch(request, callBackFunc);
  // }

  async getNearByLocations(coordinate: Coordinate, distance: number): Promise<any[]> {
    const header: HttpHeaders = this.api.getHeader();
    const body: NearbySearchReq = {
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      distance: distance
    }
    const resp: RespData = await this.api.post(this.apiCons.GET_NEARBY_SEARCH, body, header);
    if (isDevMode() || global.showLog) {
      console.log(resp);
    }
    if (this.common.checkAPIResp(resp)) {
      return resp.body.data;
    } else {
      return [];
    }
  }

  async getMyMapList(userId: string): Promise<any[]> {
    const header: HttpHeaders = this.api.getHeader();
    const resp: RespData = await this.api.get(this.apiCons.GET_MYMAP + userId, null, header);
    if (isDevMode() || global.showLog) {
      console.log(resp);
    }
    if (this.common.checkAPIResp(resp)) {
      return resp.body.data;
    } else {
      return [];
    }
  }
}
