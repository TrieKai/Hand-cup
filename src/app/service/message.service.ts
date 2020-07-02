import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private subject = new Subject<any>();
  emitted = this.subject.asObservable();

  constructor() { }

  add(message: Message) {
    this.subject.next(message);
  }
}
