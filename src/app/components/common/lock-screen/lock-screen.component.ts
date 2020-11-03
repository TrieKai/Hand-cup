import { Component, Input, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';

import { SharedService } from 'src/app/shared/shared.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { DomService } from 'src/app/util/dom.service';

@Component({
  selector: 'app-lock-screen',
  templateUrl: './lock-screen.component.html',
  styleUrls: ['./lock-screen.component.scss']
})
export class LockScreenComponent implements OnInit {
  @ViewChild('overlay', { static: true }) overlayRef: ElementRef<HTMLDivElement>;
  @Input() zIndex: number | string = 'initial';

  constructor(
    private renderer: Renderer2,
    private sharedService: SharedService,
    private cons: ConstantsService,
    private domService: DomService,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.renderer.setStyle(this.overlayRef.nativeElement, 'zIndex', this.zIndex);
  }

  close() {
    this.sharedService.setSharedData(this.cons.SHAREDDATA.lockScreen, false);
    this.domService.destroyComponent(this.sharedService.getSharedData(this.cons.SHAREDDATA.lockScreenComponentRef));
  }
}
