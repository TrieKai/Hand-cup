import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor() { }

  setCookie(name: string, value: string, expireDays?: number) {
    let expires = '';
    if (expireDays) {
      const date: Date = new Date();
      date.setTime(date.getTime() + expireDays * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}${expires}; path=/;`;
  }

  getCookie(name: string) {
    const cookieAll: Array<string> = document.cookie.split('; ');
    const cookieName = encodeURIComponent(name) + '=';
    for (const cookie of cookieAll) {
      if (cookie.indexOf(cookieName) === 0) {
        return decodeURIComponent(cookie.substring(cookieName.length));
      }
    }
    return null;
  }

  deleteCookie(name: string) {
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;`;
  }
}
