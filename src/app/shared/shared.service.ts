import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private onInit = new Subject<any>();
  onInitEmitted = this.onInit.asObservable();

  constructor() { }

  onInitEmit() {
    this.onInit.next();
  }
}
