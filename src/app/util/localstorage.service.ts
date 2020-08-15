import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

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
}
