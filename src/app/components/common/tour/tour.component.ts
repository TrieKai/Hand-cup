import { Component, Input, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import { ConstantsService } from 'src/app/util/constants/constants.service';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss']
})
export class TourComponent implements OnInit {
  @Input() step: number = 1;
  @Input() target: Element;
  @ViewChild('tourBox', { static: false }) tourBoxRef: ElementRef;
  // @ViewChild('targetRect', { static: false }) targetRectRef: ElementRef;
  componentKey: string;

  constructor(
    private cons: ConstantsService,
    private renderer: Renderer2,
  ) { }

  ngOnInit() {
    this.componentKey = this.cons.SHAREDCOMPONENT.tourComponentRef;
  }

  ngAfterViewInit(): void {
    const rect = this.target.getBoundingClientRect();
    console.log(rect)
    // this.renderer.setStyle(this.targetRectRef.nativeElement, 'width', `${rect.width + 10}px`);
    // this.renderer.setStyle(this.targetRectRef.nativeElement, 'height', `${rect.height + 10}px`);
    // this.renderer.setStyle(this.targetRectRef.nativeElement, 'top', `${rect.top - 5}px`);
    // this.renderer.setStyle(this.targetRectRef.nativeElement, 'left', `${rect.left - 5}px`);

    this.renderer.setStyle(this.tourBoxRef.nativeElement, 'top', `${rect.top + rect.height + 30}px`);
    this.renderer.setStyle(this.tourBoxRef.nativeElement, 'left', `${rect.left}px`);
  }
}
