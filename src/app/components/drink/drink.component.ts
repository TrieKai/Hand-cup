import { Component, OnInit, Renderer2, ViewChild, ElementRef, HostListener, Inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import { ConstantsService } from 'src/app/util/constants/constants.service';
import { CommonService } from 'src/app/service/common.service';
import { DomService } from 'src/app/util/dom.service';
import { SharedService } from 'src/app/shared/shared.service';
import { MessageService } from 'src/app/service/message.service';

import { ConfirmComponent } from '../../components/common/confirm/confirm.component';

@Component({
  selector: 'app-drink',
  templateUrl: './drink.component.html',
  styleUrls: ['./drink.component.scss']
})
export class DrinkComponent implements OnInit, OnDestroy {
  @ViewChild('cardImage', { static: false }) cardImageRef: ElementRef<HTMLDivElement>;
  @ViewChild('image', { static: false }) imageRef: ElementRef<HTMLImageElement>;
  @ViewChild('hint', { static: false }) hintRef: ElementRef<HTMLParagraphElement>;
  infoMessage: string;
  confirmBS: BehaviorSubject<boolean>; // Confirm callback trigger
  gocha: boolean;
  drinksData: drinksData[];
  drink: drinksData;
  step: number;
  isFinished: boolean;
  showLeftFirework: boolean;
  showRightFirework: boolean;
  showHint: boolean;
  hintText: string;
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
  }

  @HostListener('document:touchend', ['$event'])
  onDropMobile(e: any) {
    if (this.dragEnabled) {
      this.handleChoosenCard(e.changedTouches[0]);
    } else { return; }
    this.dragEnabled = false;
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private cons: ConstantsService,
    private renderer: Renderer2,
    private common: CommonService,
    private domService: DomService,
    private sharedService: SharedService,
    private message: MessageService,
  ) { }

  ngOnInit() {
    this.step = 0;
    this.infoMessage = '今天飲料喝什麼?';

    // TODO: Replace API with this
    this.drinksData = [
      {
        name: '綠茶', image: 'https://www.chingshin.tw/includes/timthumb.php?src=upload/product_catalog/1703101143220000001.png&w=280&h=350&zc=2',
        subDrinks: [{ name: '普洱茶' }, { name: '烏龍茶' }, { name: '多多綠' }]
      },
      {
        name: '紅茶', image: 'https://www.chingshin.tw/includes/timthumb.php?src=upload/product_catalog/1705151055490000001.png&w=280&h=350&zc=2',
        subDrinks: [{ name: '大正紅茶' }, { name: '錫蘭紅茶' }]
      },
      {
        name: '奶茶', image: 'https://www.chingshin.tw/includes/timthumb.php?src=upload/product_catalog/1904241008320000001.png&w=280&h=350&zc=2',
        subDrinks: [{ name: '珍珠奶茶' }, { name: '鮮奶茶' }]
      },
      { name: '珍珠鮮奶', image: 'https://www.chingshin.tw/includes/timthumb.php?src=upload/product_catalog/1904240957570000001.png&w=280&h=350&zc=2' },
      {
        name: '果汁', image: 'https://www.chingshin.tw/includes/timthumb.php?src=upload/product_catalog/1801251627300000001.png&w=280&h=350&zc=2',
        subDrinks: [{ name: '柳橙' }, { name: '檸檬' }]
      },
      {
        name: '冬瓜檸檬', image: 'https://www.chingshin.tw/includes/timthumb.php?src=upload/product_catalog/1703101144190000001.png&w=280&h=350&zc=2',
        subDrinks: [{ name: '冬瓜茶' }, { name: '冬瓜檸檬' }, { name: '冬瓜鮮奶' }, { name: '冬瓜綠茶' }]
      },
      { name: '多多綠', image: 'https://www.chingshin.tw/includes/timthumb.php?src=upload/product_catalog/1703101144260000001.png&w=280&h=350&zc=2' },
      { name: '冰淇淋紅茶', image: 'https://www.chingshin.tw/includes/timthumb.php?src=upload/product_catalog/1703101144340000001.png&w=280&h=350&zc=2' },
      { name: '蜂蜜檸檬', image: 'https://www.chingshin.tw/includes/timthumb.php?src=upload/product_catalog/2002121650500000001.png&w=280&h=350&zc=2' },
    ];
    this.hintText = '請點選圖片左右邊來選擇';
  }

  ngOnDestroy(): void {
    if (this.confirmBS) {
      this.sharedService.deleteStatus(this.cons.SHAREDSTATUS.isConfirm);
      this.confirmBS.unsubscribe();
    }
  }

  recommendDrinks(step: number) {
    this.step = step;
    if (this.isFinished && this.imageRef) {
      this.renderer.removeClass(this.imageRef.nativeElement, 'faderight');
      this.renderer.removeClass(this.imageRef.nativeElement, 'fadeLeft');
    }
    this.gocha = true;
    this.isFinished = this.showLeftFirework = this.showRightFirework = false;

    let shuffledDrinks: any[];
    if (step === 1) {
      shuffledDrinks = this.shuffle(this.drinksData);
    } else if (step === 2) {
      if (!this.drink.subDrinks) { return; }
      shuffledDrinks = this.shuffle(this.drink.subDrinks);
    }

    const concatedData = shuffledDrinks
      .concat(shuffledDrinks)
      .concat(shuffledDrinks)
      .concat(shuffledDrinks); // Concat data triple times
    this.randomDrinks(concatedData, step);
  }

  randomDrinks(dataList: any[], step: number) {
    let drinksDataLength: number;
    if (step === 1) {
      drinksDataLength = this.drinksData.length;
    } else if (step === 2) {
      drinksDataLength = this.drink.subDrinks.length;
    }

    const choesnIndex = Math.floor(Math.random() * drinksDataLength);
    for (let i = 0; i < dataList.length; i++) {
      const flag = (i === drinksDataLength * 3 + choesnIndex) ? true : false;
      setTimeout(() => {
        if (flag) {
          this.step = step++;
          this.isFinished = this.showLeftFirework = this.showHint = true;
          setTimeout(() => { this.showRightFirework = true; }, 500); // Right firework delay 0.5s
          // Add cursor pointer to cardImage when not on mobile
          const isMobile = this.common.detectDeviceType().mobile;
          if (!isMobile) {
            this.renderer.addClass(this.cardImageRef.nativeElement, 'pointer');
          }
        }
        this.drink = dataList[i];
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

    this.showHint = false;
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
    this.description = '還是?';
    this.showHint = true;

    const distanceX = e.clientX - this.originPos.x;
    if (this.chooseType === this.cons.DIRECTION.left) {
      if (distanceX < 0) {
        const componentRef = this.domService.createComponent(
          ConfirmComponent,
          this.cons.SHAREDDATA.confirmComponentRef,
          { closeButton: true, title: '', message: '確定要重新選飲料嗎?' }
        );
        this.domService.attachComponent(componentRef, this.document.body);

        this.confirmBS = this.sharedService.getStatus(this.cons.SHAREDSTATUS.isConfirm); // Confirm listener
        this.confirmBS.subscribe((status) => {
          if (status === null) { return; }
          if (status) {
            this.renderer.addClass(this.imageRef.nativeElement, 'fadeLeft');
            setTimeout(() => {
              this.recommendDrinks(1); // Redo random drinks
              this.description = '';
            }, 500);
          }
          // Unscribe confirm listener
          this.sharedService.deleteStatus(this.cons.SHAREDSTATUS.isConfirm);
          this.confirmBS.unsubscribe();
        });
      } else { return; }
    } else if (this.chooseType === this.cons.DIRECTION.right) {
      if (distanceX > 0) {
        if (!this.drink.subDrinks) {
          this.message.add({ type: this.cons.MESSAGE_TYPE.info, title: '沒有下一層囉!', content: '' });
          this.description = '就是這個啦!';
          return;
        }
        this.renderer.addClass(this.imageRef.nativeElement, 'fadeRight');
        this.step = 2;
        this.recommendDrinks(2);
      } else { return; }
    }
  }
}
