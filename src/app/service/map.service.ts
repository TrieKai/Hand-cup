import { Injectable, isDevMode } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { ApiService } from '../util/api.service';
import { ApiConstantsService } from '../util/constants/api-constants.service';

import { GlobalService as global } from '../service/global.service';

@Injectable({
    providedIn: 'root'
})
export class MapService {

    constructor(
        private http: ApiService,
        private apiCons: ApiConstantsService,
    ) { }

    async getNearByLocationsByFrontend(map: google.maps.Map, request: object, callBackFunc: any): Promise<void> {
        const placesService = new google.maps.places.PlacesService(map);
        placesService.nearbySearch(request, callBackFunc);
    }

    async getNearByLocations(coordinates: google.maps.LatLng): Promise<RespData> {
        const header: HttpHeaders = new HttpHeaders({
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
        });
        const body: NearbySearchQueryParam = {
            coordinates: coordinates
        }
        const resp: RespData = await this.http.post(this.apiCons.GET_NEARBY_SEARCH, body, header);
        if (isDevMode() || global.showLog) {
            console.log(resp);
        }

        return resp;
    }
}
