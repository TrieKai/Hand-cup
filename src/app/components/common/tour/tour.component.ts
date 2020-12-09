import { Component, Input, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import { ConstantsService } from 'src/app/util/constants/constants.service';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss']
})
export class TourComponent implements OnInit {
  @Input() data: TourData[];
  @ViewChild('tourBox', { static: false }) tourBoxRef: ElementRef;
  @ViewChild('ripple', { static: false }) rippleRef: ElementRef;
  showBack: boolean;
  showNext: boolean;
  currentStep: number;
  title: string;
  content: string;

  constructor(
    private cons: ConstantsService,
    private renderer: Renderer2,
  ) { }

  ngOnInit() {
    this.showBack = false;
    this.data.length <= 1 ? this.showNext = false : this.showNext = true;
    this.currentStep = 1;
  }

  ngAfterViewInit(): void {
    this.renderTour();
  }

  back() {
    if (this.currentStep <= 2) {
      this.showBack = false;
    }
    this.currentStep--;
    this.renderTour();
  }

  next() {
    if (this.currentStep >= this.data.length - 1) {
      this.showNext = false;
    }
    this.currentStep++;
    this.renderTour();
  }

  renderTour() {
    const rect = this.data[0].target.getBoundingClientRect();
    console.log(rect)
    this.renderer.setStyle(this.rippleRef.nativeElement, 'top', `${rect.top - 5}px`);
    this.renderer.setStyle(this.rippleRef.nativeElement, 'left', `${rect.left - 5}px`);

    this.renderer.setStyle(this.tourBoxRef.nativeElement, 'top', `${rect.top + rect.height + 30}px`);
    this.renderer.setStyle(this.tourBoxRef.nativeElement, 'left', `${rect.left}px`);

    this.title = this.data[this.currentStep - 1].title;
    this.content = this.data[this.currentStep - 1].content;
  }
}
