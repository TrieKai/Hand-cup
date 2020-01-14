import { Injectable, isDevMode } from '@angular/core';

import { GlobalService as global } from '../service/global.service';

@Injectable({
    providedIn: 'root'
})
export class MapService {

    constructor() { }

    async getNearByLocations(map: google.maps.Map, request: object, callBackFunc: any): Promise<void> {
        const placesService = new google.maps.places.PlacesService(map);
        placesService.nearbySearch(request, callBackFunc);
    }
}
