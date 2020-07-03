import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';

import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-message-block',
  templateUrl: './message-block.component.html',
  styleUrls: ['./message-block.component.scss']
})
export class MessageBlockComponent implements OnInit {
  @Input() message: Message;
  @Input() index: number;
  @Output() remove = new EventEmitter();
  class: { [key: string]: boolean };

  constructor() { }

  ngOnInit() {
    this.class = { [`${this.message.type}`]: true };
  }

  ngAfterViewInit() {
    if (!this.message.sticky) {
      setTimeout(() => {
        this.removeMessage();
      }, 3500);
    }
  }

  removeMessage() {
    this.class.remove = true;
    setTimeout(() => {
      this.remove.emit(this.index);
    }, 500);
  }
}
