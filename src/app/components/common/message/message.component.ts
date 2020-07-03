import { Component, OnInit, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';

import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, AfterViewInit, OnDestroy {
  messages: Message[] = [];
  buffer: Message[] = [];
  max: number;

  subscribe: Subscription;

  constructor(
    private message: MessageService,
  ) { }

  @HostListener('window:resize', [])
  onResize() {
    this.max = Math.floor((window.innerHeight - 10) / 84);

    while (this.messages.length > this.max) {
      this.messages.shift(); // Remove first element
    }
  }

  ngOnInit() {
    this.subscribe = this.message.emitted.subscribe((message: Message) => {
      this.addMessage(message);
    })
  }

  ngAfterViewInit() {
    this.onResize();
  }

  ngOnDestroy() {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
  }

  addMessage(message?: Message) {
    if (message) {
      this.buffer.push(message);
    }

    if (this.messages.length < this.max && this.buffer.length) {
      this.messages.unshift(this.buffer[0]);
      this.buffer.shift();
    }
  }

  removeMessage(index: number) {
    this.messages.splice(index, 1);
    this.addMessage();
  }

  getBottom(index: number): { bottom: string } {
    return {
      bottom: `${index * 84 + 5}px`
    };
  }
}
