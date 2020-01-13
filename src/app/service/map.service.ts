import { Injectable, isDevMode } from '@angular/core';

import { ApiService } from 'src/app/util/api.service';
import { GlobalService as global } from '../service/global.service';

@Injectable({
    providedIn: 'root'
})
export class MapService {
    searchPlaceAPI: string = '';
    baseUrl: string = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
    parm: string = `location=25.041305599999998,121.54798079999998&radius=1500&keyword=drink&key=${this.searchPlaceAPI}`;

    constructor(
        private http: ApiService,
    ) { }

    async getNearByLocations() {
        const url = this.baseUrl + this.parm;
        console.log(url)
        const resp = await this.http.get(url);
        if (isDevMode() || global.showLog) {
            console.log('getIssueList:', resp);
        }
        return resp;
    }
}
