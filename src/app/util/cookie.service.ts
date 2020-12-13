import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) { }

  setCookie(name: string, value: string, expireTime?: number) {
    let expires = '';
    if (expireTime) {
      const date: Date = new Date(expireTime * 1000);
      expires = `; expires=${date}`;
    }
    this.document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}${expires}; path=/;`;
  }

  getCookie(name: string) {
    const cookieAll: Array<string> = this.document.cookie.split('; ');
    const cookieName = encodeURIComponent(name) + '=';
    for (const cookie of cookieAll) {
      if (cookie.indexOf(cookieName) === 0) {
        return decodeURIComponent(cookie.substring(cookieName.length));
      }
    }
    return null;
  }

  deleteCookie(name: string) {
    this.document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;`;
  }
}
