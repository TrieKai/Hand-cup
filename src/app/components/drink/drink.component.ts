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
  listen: any;
  gocha: boolean;
  drinksData: drinksData[];
  drink: drinksData;
  isFinished: boolean;

  constructor(
    private cons: ConstantsService,
    private message: MessageService,
  ) { }

  ngOnInit() {
    this.infoMessage = '今天飲料喝什麼?';

    // TODO: Replace API with this
    this.drinksData = [
      { name: '綠茶', image: 'https://www.chingshin.tw/includes/timthumb.php?src=upload/product_catalog/1703101143220000001.png&w=280&h=350&zc=2' },
      { name: '紅茶', image: 'https://www.chingshin.tw/includes/timthumb.php?src=upload/product_catalog/1705151055490000001.png&w=280&h=350&zc=2' },
      { name: '奶茶', image: 'https://www.chingshin.tw/includes/timthumb.php?src=upload/product_catalog/1904241008320000001.png&w=280&h=350&zc=2' },
      { name: '珍珠鮮奶', image: 'https://www.chingshin.tw/includes/timthumb.php?src=upload/product_catalog/1904240957570000001.png&w=280&h=350&zc=2' },
      { name: '果汁', image: 'https://www.chingshin.tw/includes/timthumb.php?src=upload/product_catalog/1801251627300000001.png&w=280&h=350&zc=2' },
      { name: '冬瓜檸檬', image: 'https://www.chingshin.tw/includes/timthumb.php?src=upload/product_catalog/1703101144190000001.png&w=280&h=350&zc=2' },
      { name: '多多綠', image: 'https://www.chingshin.tw/includes/timthumb.php?src=upload/product_catalog/1703101144260000001.png&w=280&h=350&zc=2' },
      { name: '冰淇淋紅茶', image: 'https://www.chingshin.tw/includes/timthumb.php?src=upload/product_catalog/1703101144340000001.png&w=280&h=350&zc=2' },
      { name: '蜂蜜檸檬', image: 'https://www.chingshin.tw/includes/timthumb.php?src=upload/product_catalog/2002121650500000001.png&w=280&h=350&zc=2' },
    ];
  }

  confirm() {
    this.message.add({ type: this.cons.MESSAGE_TYPE.warn, title: '什麼事都沒發生', content: '' });
  }

  recommendDrinks() {
    this.gocha = true;
    this.isFinished = false;
    const shuffledDrinks = this.shuffle(this.drinksData);
    const concatedData = shuffledDrinks
      .concat(shuffledDrinks)
      .concat(shuffledDrinks)
      .concat(shuffledDrinks); // Concat data triple times
    const drinksDataLength = this.drinksData.length;
    const choesnIndex = Math.floor(Math.random() * drinksDataLength);
    for (let i = 0; i < concatedData.length; i++) {
      const flag = (i === drinksDataLength * 3 + choesnIndex) ? true : false;
      setTimeout(() => {
        if (flag) { this.isFinished = true; }
        this.drink = concatedData[i];
      }, 100 * Math.pow(i / 2, 1.5)); // 參數隨便調的啦
      if (flag) { break; } // Break point
    }
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
