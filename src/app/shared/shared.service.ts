import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private onInit = new Subject<any>();
  onInitEmitted = this.onInit.asObservable();
  protected elements: any;

  constructor() { }

  onInitEmit() {
    this.onInit.next();
    this.elements = {};
  }

  public set(key: string, value: HTMLElement): BehaviorSubject<any> {
    if (this.has(key)) {
      this.elements[key].next(value);
    } else {
      this.elements[key] = new BehaviorSubject(value);
    }
    return this.elements[key];
  }

  public get(key: string): BehaviorSubject<any> {
    // We'll always ensure a Subject is returned just incase the HTMLElement hasn't been registered "yet"
    if (!this.has(key)) {
      this.elements[key] = new BehaviorSubject(null);
    }
    return this.elements[key];
  }

  public delete(key: string) {
    if (this.has(key)) {
      this.elements[key].next(null);
      delete this.elements[key];
    }
  }

  public clear() {
    for (const key in Object.keys(this.elements)) {
      if (this.elements.hasOwnProperty(key)) {
        this.elements[key].next(null);
        delete this.elements[key];
      }
    }
    this.elements = {};
  }

  public has(key: string) {
    return (this.elements[key] instanceof BehaviorSubject);
  }
}
