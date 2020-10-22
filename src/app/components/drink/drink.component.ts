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
  gocha: boolean;
  drinksData: drinksData[];
  // shuffledDrinks: drinksData[];
  drink: drinksData;

  constructor(
    private cons: ConstantsService,
    private message: MessageService,
  ) { }

  ngOnInit() {
    this.infoMessage = '今天飲料喝什麼?';

    // TODO: Replace API with this
    this.drinksData = [
      { name: '綠茶', img: 'assets/img/drinks/' },
      { name: '紅茶', img: 'assets/img/drinks/' },
      { name: '奶茶', img: 'assets/img/drinks/' },
      { name: '珍珠鮮奶', img: 'assets/img/drinks/' },
      { name: '果汁', img: 'assets/img/drinks/' },
      { name: '冬瓜檸檬', img: 'assets/img/drinks/' },
      { name: '多多綠', img: 'assets/img/drinks/' },
      { name: '冰淇淋紅茶', img: 'assets/img/drinks/' },
      { name: '蜂蜜檸檬', img: 'assets/img/drinks/' },
    ];
  }

  recommendDrinks() {
    // this.message.add({ type: this.cons.MESSAGE_TYPE.warn, title: '注意!', content: '還沒做啦QQ' });
    let shuffledDrinks = this.shuffle(this.drinksData);
    shuffledDrinks = shuffledDrinks.concat(shuffledDrinks).concat(shuffledDrinks);
    console.log(shuffledDrinks)
    this.gocha = true;
    const drinksDataLength = this.drinksData.length;
    const choesnIndex = Math.floor(Math.random() * drinksDataLength);
    console.log(choesnIndex)
    for (let i = 0; i < shuffledDrinks.length; i++) {
      if (i === (drinksDataLength * 2) + choesnIndex) { break; }

      setTimeout(() => {
        console.log('JOJO:', i)
        this.drink = shuffledDrinks[i];
      }, 200 * i);
    }
  }

  open() {
    this.show = true;
  }

  // Fisher-Yates Shuffling
  shuffle(array: any[]) {
    let temp: any;
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  }
}
