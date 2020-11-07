import { Injectable } from '@angular/core';

import { ConstantsService } from 'src/app/util/constants/constants.service';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor(
    private cons: ConstantsService,
  ) { }

  setLocalStorage(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  getLocalStorage(key: string) {
    return localStorage.getItem(key);
  }

  removeLocalStorage(key: string) {
    if (this.getLocalStorage(key)) {
      localStorage.removeItem(key);
    }
  }

  updateLocalStorage(preferData: any[]) {
    console.log(preferData)
    if (preferData === null) { return; }
    const favorites: userPreferData[] = preferData[0];
    const visiteds: userPreferData[] = preferData[1];

    localStorage.clear(); // Clear all storage
    favorites.forEach((favorite) => {
      this.setLocalStorage(favorite.place_id, this.cons.LOCAL_STORAGE_TYPE.favorite);
    });

    // Visited 比較複雜因為會跟前面的 favorite's key 重複
    visiteds.forEach((visited) => {
      const value = this.getLocalStorage(visited.place_id);
      if (value) {
        if (value.indexOf(this.cons.LOCAL_STORAGE_TYPE.visited) === -1) {
          const valueStr = value + this.cons.LOCAL_STORAGE_TYPE.visited + ';';
          this.setLocalStorage(visited.place_id, valueStr);
        }
      } else {
        this.setLocalStorage(this.cons.LOCAL_STORAGE_TYPE.visited, visited.place_id);
      }
    });
  }
}
