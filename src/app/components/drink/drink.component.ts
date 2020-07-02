import { Component, OnInit } from '@angular/core';

import { ConstantsService } from 'src/app/util/constants/constants.service';
import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-drink',
  templateUrl: './drink.component.html',
  styleUrls: ['./drink.component.scss']
})
export class DrinkComponent implements OnInit {

  constructor(
    private cons: ConstantsService,
    private message: MessageService
  ) { }

  ngOnInit() {
    this.message.add({ type: this.cons.MESSAGE_TYPE.success, title: 'Hiiiiiiii', content: 'GGGGGGGGG' });
  }

  recommendDrinks() {
    console.log('recommend!')
  }
}
