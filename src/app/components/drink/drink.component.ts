import { Component, OnInit, Renderer2, ViewChild, ElementRef, HostListener } from '@angular/core';

import { ConstantsService } from 'src/app/util/constants/constants.service';
import { MessageService } from 'src/app/service/message.service';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-drink',
  templateUrl: './drink.component.html',
  styleUrls: ['./drink.component.scss']
})
export class DrinkComponent implements OnInit {
  @ViewChild('cardImage', { static: false }) cardImageRef: ElementRef<HTMLDivElement>;
  @ViewChild('image', { static: false }) imageRef: ElementRef<HTMLImageElement>;
  infoMessage: string;
  listen: any;
  gocha: boolean;
  drinksData: drinksData[];
  drink: drinksData;
  isFinished: boolean;
  showLeftFirework: boolean;
  showRightFirework: boolean;
  description: string;
  chooseType: string;
  dragEnabled: boolean;
  originPos: { x: number, y: number } = { x: 0, y: 0 };
  newPos: { x: number, y: number } = { x: 0, y: 0 };

  @HostListener('document:mouseup', ['$event'])
  onDrop(e: any) {
    if (this.dragEnabled) {
      this.handleChoosenCard(e);
    } else { return; }
    this.dragEnabled = false;
    this.description = '還是?';
  }

  @HostListener('document:touchend', ['$event'])
  onDropMobile(e: any) {
    if (this.dragEnabled) {
      this.handleChoosenCard(e.changedTouches[0]);
    } else { return; }
    this.dragEnabled = false;
    this.description = '還是?';
  }

  constructor(
    private cons: ConstantsService,
    private message: MessageService,
    private renderer: Renderer2,
    private common: CommonService,
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
    this.description = '請點選圖片左右邊來選擇';
  }

  recommendDrinks() {
    this.gocha = true;
    this.isFinished = this.showLeftFirework = this.showRightFirework = false;

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
        if (flag) {
          this.isFinished = this.showLeftFirework = true;
          setTimeout(() => { this.showRightFirework = true; }, 500); // Right firework delay 500ms
          // Add cursor pointer to cardImage when not on mobile
          const isMobile = this.common.detectDeviceType().mobile;
          if (!isMobile) {
            this.renderer.addClass(this.cardImageRef.nativeElement, 'pointer');
          }
        }
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

  choose(e: any, type: string, isMobile: boolean) {
    if (!this.isFinished) { return; }

    if (type === this.cons.DIRECTION.left) {
      this.chooseType = this.cons.DIRECTION.left;
      this.description = '我不想喝啦! (往左滑動)';
    } else if (type === this.cons.DIRECTION.right) {
      this.chooseType = this.cons.DIRECTION.right;
      this.description = '進入下一層? (往右滑動)';
    }

    if (!isMobile) {
      e.preventDefault();
      this.originPos = { x: e.clientX, y: e.clientY };
    } else {
      this.originPos = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };
    }
    this.dragEnabled = true;
  }

  handleChoosenCard(e: any) {
    const distanceX = e.clientX - this.originPos.x;
    if (this.chooseType === this.cons.DIRECTION.left) {
      if (distanceX < 0) {
        this.renderer.addClass(this.imageRef.nativeElement, 'fadeLeft');
      } else { return; }
    } else if (this.chooseType === this.cons.DIRECTION.right) {
      if (distanceX > 0) {
        this.renderer.addClass(this.imageRef.nativeElement, 'fadeRight');
      } else { return; }
    }
  }
}
