import { Component, OnInit, Renderer2, ViewChild, ElementRef, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { ConstantsService } from 'src/app/util/constants/constants.service';
import { CommonService } from 'src/app/service/common.service';
import { DomService } from 'src/app/util/dom.service';
import { MessageService } from 'src/app/service/message.service';
import { GlobalService as global } from '../../service/global.service';
import { SharedService } from 'src/app/shared/shared.service';

import { ConfirmComponent } from '../../components/common/confirm/confirm.component';

@Component({
  selector: 'app-drink',
  templateUrl: './drink.component.html',
  styleUrls: ['./drink.component.scss']
})
export class DrinkComponent implements OnInit {
  @ViewChild('cardImage', { static: false }) cardImageRef: ElementRef<HTMLDivElement>;
  @ViewChild('image', { static: false }) imageRef: ElementRef<HTMLImageElement>;
  @ViewChild('hint', { static: false }) hintRef: ElementRef<HTMLParagraphElement>;
  infoMessage: string;
  gocha: boolean;
  drinksData: drinksData[];
  drink: drinksData;
  chosenDrinkType: drinksData; // Chosen drink type by step 1
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
    private message: MessageService,
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
    this.step = 0;
    this.infoMessage = '今天飲料喝什麼?';

    // TODO: Replace API with this
    this.drinksData = this.cons.DRINKS;
    this.hintText = '請點選並拖曳圖片的左右邊';
  }

  async recommendDrinks(step: number) {
    await this.loadImages(this.drinksData); // loaded drinks images first

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
      if (!this.chosenDrinkType.subDrinks) { return; }
      shuffledDrinks = this.shuffle(this.chosenDrinkType.subDrinks);
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
      drinksDataLength = this.chosenDrinkType.subDrinks.length;
    }

    const choesnIndex = Math.floor(Math.random() * drinksDataLength);
    for (let i = 0; i < dataList.length; i++) {
      const flag = (i === drinksDataLength * 3 + choesnIndex) ? true : false;
      setTimeout(() => {
        if (flag) {
          this.isFinished = this.showLeftFirework = this.showHint = true;
          setTimeout(() => { this.showRightFirework = true; }, 500); // Right firework delay 0.5s

          if (step === 1) {
            // Add cursor pointer to cardImage when not on mobile
            const isMobile = this.common.detectDeviceType().mobile;
            if (!isMobile) {
              this.renderer.addClass(this.cardImageRef.nativeElement, 'pointer');
            }
            this.chosenDrinkType = dataList[i]; // Set chosen drink type
          } else if (step === 2) {
            setTimeout(async () => {
              if (global.showSubNotification && Notification.permission !== 'granted') {
                global.showSubNotification = await this.common.subNotification();
              }
            }, 1500);
          }
          this.step = step++;
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
          this.cons.SHAREDCOMPONENT.confirmComponentRef,
          { closeButton: true, title: '', message: '確定要重新選飲料嗎?' }
        );
        this.domService.attachComponent(componentRef, this.document.body);
        componentRef.instance.callback
          .toPromise()
          .then((status: boolean) => {
            if (status) {
              this.renderer.addClass(this.imageRef.nativeElement, 'fadeLeft');
              setTimeout(() => {
                this.recommendDrinks(1); // Redo random drinks
                this.description = '';
              }, 500);
            }
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

  loadImages(images: drinksData[]): Promise<void> {
    let i: number = 0;
    this.sharedService.setStatus(this.cons.SHAREDSTATUS.onloading, true);

    return new Promise((reslove, reject) => {
      images.forEach(image => {
        const img = new Image();
        img.onload = () => {
          i++;
          if (i === images.length) {
            this.sharedService.setStatus(this.cons.SHAREDSTATUS.onloading, false);
            reslove();
          }
        }
        img.src = image.image;
      });
    });
  }
}
