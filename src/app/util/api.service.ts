import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpRequest, HttpEventType } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

import { GlobalService as global } from '../service/global.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }

  getHeader(accessToken?: string): HttpHeaders {
    const header = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
    if (accessToken) { header['Authorization'] = `Bearer ${accessToken}` };
    return new HttpHeaders(header);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
      return Promise.resolve(error.error);
    }

    return Promise.resolve({ header: { status: '' } });
  }

  async get(url: string, param?: object, header?: HttpHeaders): Promise<any> {
    const options: any = {};
    if (param) { options.params = param; }
    if (header) { options.headers = header; }
    if (isDevMode() || global.showLog) {
      console.log('url:', url);
      console.log('para:', param);
    }
    const resp = await this.http.get(url, options).pipe(catchError(this.handleError)).toPromise();
    return resp;
  }

  async post(url: string, body?: object, header?: HttpHeaders): Promise<any> {
    const options: any = {};
    if (header) { options.headers = header; }
    if (isDevMode() || global.showLog) {
      console.log('url:', url);
      console.log('body:', body);
    }
    const resp = await this.http.post(url, body, options).pipe(catchError(this.handleError)).toPromise();
    return resp;
  }

  async delete(url: string, param?: object, header?: HttpHeaders): Promise<any> {
    const options: any = {};
    if (param) { options.params = param; }
    if (header) { options.headers = header; }
    if (isDevMode() || global.showLog) {
      console.log('url:', url);
      console.log('para:', param);
    }
    const resp = await this.http.delete(url, options).pipe(catchError(this.handleError)).toPromise();
    return resp;
  }

  async put(url: string, body?: object, header?: HttpHeaders): Promise<any> {
    const options: any = {};
    if (header) { options.headers = header; }
    if (isDevMode() || global.showLog) {
      console.log('url:', url);
      console.log('body:', body);
    }
    const resp = await this.http.put(url, body, options).pipe(catchError(this.handleError)).toPromise();
    return resp;
  }

  async postFile(url: string, file: FormData, param?: object, header?: any): Promise<any> {
    if (param) {
      url = url + '?';
      for (const key of Object.keys(param)) {
        url = url + `${key}=${param[key]}&`;
      }
      url = url.slice(0, -1);
    }
    const req = new HttpRequest('POST', url, file, {
      headers: header
    });
    if (isDevMode() || global.showLog) {
      console.log('url:', url);
      console.log('para:', param);
      console.log('file:', file);
    }
    const resp = await this.http.request(req).pipe(map(event => {
      switch (event.type) {
        case HttpEventType.Response:
          return Promise.resolve(event.body);
      }
    }), catchError(this.handleError)).toPromise();
    return resp;
  }
}
