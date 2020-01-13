import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  // for developer
  public static showLog = false;

  constructor() { }
}
