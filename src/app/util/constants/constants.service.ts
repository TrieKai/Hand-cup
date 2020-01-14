import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  public readonly STATUS = {
    ok: 'OK',
    error: 'ERROR',
  }

  constructor() { }
}
