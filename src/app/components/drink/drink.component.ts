import { Component, OnInit } from '@angular/core';

import { ConstantsService } from 'src/app/util/constants/constants.service';
import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-drink',
  templateUrl: './drink.component.html',
  styleUrls: ['./drink.component.scss']
})
export class DrinkComponent implements OnInit {
  infoMessage: string;
  show: boolean;
  listen: any;

  constructor(
    private cons: ConstantsService,
    private message: MessageService,
  ) { }

  ngOnInit() {
    this.infoMessage = '今天飲料喝什麼?';
  }

  recommendDrinks() {
    this.message.add({ type: this.cons.MESSAGE_TYPE.warn, title: '注意!', content: '還沒做啦QQ' });
  }

  open() {
    this.show = true;
  }
}
