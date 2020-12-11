import { Component, Input, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectorRef, AfterViewInit, AfterViewChecked } from '@angular/core';

import { ConstantsService } from 'src/app/util/constants/constants.service';
import { SharedService } from 'src/app/shared/shared.service';
import { DomService } from 'src/app/util/dom.service';
import { LocalstorageService } from 'src/app/util/localstorage.service';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss']
})
export class TourComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @Input() data: TourData[];
  @ViewChild('tourBox', { static: false }) tourBoxRef: ElementRef<HTMLDivElement>;
  @ViewChild('ripple', { static: false }) rippleRef: ElementRef<HTMLDivElement>;
  componentKey: string;
  showBack: boolean;
  showNext: boolean;
  finishTour: boolean;
  currentStep: number;
  title: string;
  content: string;

  constructor(
    private renderer: Renderer2,
    private cons: ConstantsService,
    private sharedService: SharedService,
    private domService: DomService,
    private localStorageService: LocalstorageService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.componentKey = this.cons.SHAREDCOMPONENT.tourComponentRef;
    this.showBack = false;
    this.data.length <= 1 ? this.showNext = false : this.showNext = true;
    this.currentStep = 1;
    this.title = '';
    this.content = '';
  }

  ngAfterViewInit(): void {
    this.renderTour();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  back() {
    if (this.currentStep <= 2) {
      this.showBack = false;
    }
    if (this.currentStep === this.data.length) {
      this.showNext = true;
    }
    this.currentStep--;
    this.renderTour();
  }

  next() {
    if (this.currentStep >= this.data.length - 1) {
      this.showNext = false;
    }
    this.currentStep++;
    this.showBack = true;
    this.renderTour();
  }

  finish() {
    this.finishTour = true;
    this.localStorageService.setLocalStorage(this.cons.LOCAL_STORAGE_TYPE.tour, this.cons.STATUS.false);
  }

  close() {
    this.domService.destroyComponent(this.sharedService.getSharedComponent(this.cons.SHAREDCOMPONENT.tourComponentRef));
  }

  renderTour() {
    const rect = this.data[this.currentStep - 1].target.getBoundingClientRect();
    // Ripple position
    this.renderer.setStyle(this.rippleRef.nativeElement, 'top', `${rect.top - 5}px`);
    this.renderer.setStyle(this.rippleRef.nativeElement, 'left', `${rect.left - 5}px`);

    // Box position
    if (this.data[this.currentStep - 1].position) {
      const position = this.data[this.currentStep - 1].position;
      position.top ?
        this.renderer.setStyle(this.tourBoxRef.nativeElement, 'top', `${position.top}px`) :
        this.renderer.setStyle(this.tourBoxRef.nativeElement, 'top', 'initial');
      position.right ?
        this.renderer.setStyle(this.tourBoxRef.nativeElement, 'right', `${position.right}px`) :
        this.renderer.setStyle(this.tourBoxRef.nativeElement, 'right', 'initial');
      position.bottom ?
        this.renderer.setStyle(this.tourBoxRef.nativeElement, 'bottom', `${position.bottom}px`) :
        this.renderer.setStyle(this.tourBoxRef.nativeElement, 'bottom', 'initial');
      position.left ?
        this.renderer.setStyle(this.tourBoxRef.nativeElement, 'left', `${position.left}px`) :
        this.renderer.setStyle(this.tourBoxRef.nativeElement, 'left', 'initial');
    } else {
      if ((window.innerWidth - rect.left) > 260) { // 260px 為 tour box 固定寬度
        this.renderer.setStyle(this.tourBoxRef.nativeElement, 'left', `${rect.left}px`);
        this.renderer.setStyle(this.tourBoxRef.nativeElement, 'right', 'initial');
      } else {
        this.renderer.setStyle(this.tourBoxRef.nativeElement, 'right', `${rect.left}px`);
        this.renderer.setStyle(this.tourBoxRef.nativeElement, 'left', 'initial');
      }
      if ((window.innerHeight - rect.top) > 174) { // 174px 為 tour box 最大高度
        this.renderer.setStyle(this.tourBoxRef.nativeElement, 'top', `${rect.top + rect.height + 30}px`);
      } else {
        this.renderer.setStyle(this.tourBoxRef.nativeElement, 'top', `${rect.top - 174}px`);
      }
    }

    this.title = this.data[this.currentStep - 1].title;
    this.content = this.data[this.currentStep - 1].content;
    setTimeout(() => {
      this.sharedService.setTourStep(this.currentStep);
    }, this.data[this.currentStep - 1].timeout);
  }
}
