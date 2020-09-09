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

  constructor(
    private cons: ConstantsService,
    private message: MessageService
  ) { }

  ngOnInit() {
    this.infoMessage = this.cons.INFO_MESSAGE.drinks;
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      console.log(img.src);
    }
    img.src = 'https://boba-maps.s3-ap-southeast-1.amazonaws.com/media/5f531a2989872f0e0f79b166.JPG';
  }

  recommendDrinks() {
    this.message.add({ type: this.cons.MESSAGE_TYPE.warn, title: '注意!', content: '還沒做啦QQ' });
  }
}
