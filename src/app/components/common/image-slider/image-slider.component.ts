import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss']
})
export class ImageSliderComponent implements OnInit {
  @ViewChild('preImage', { static: false }) preImage: ElementRef<HTMLDivElement>;
  @ViewChild('nowImage', { static: false }) nowImage: ElementRef<HTMLDivElement>;
  @ViewChild('subImage', { static: false }) subImage: ElementRef<HTMLDivElement>;
  @Input() width: number = 300;
  @Input() height: number = 300;
  @Input() images: string[];
  showPreImg: boolean = false;
  showNowImg: boolean = false;
  showSubImg: boolean = false;
  nowImageIndex: number = 0;

  constructor(
    private renderer: Renderer2,
  ) { }

  ngOnInit() {
    this.showNowImg = true;
  }

  ngAfterViewInit(): void {
    this.renderer.setStyle(this.nowImage.nativeElement, 'background-image', 'url(' + this.images[this.nowImageIndex] + ')');
  }

  containerStyles(): object {
    return {
      'width': this.width + 'px',
      'height': this.height + 'px'
    };
  }

  changePreImage() {
    this.nowImageIndex -= 1;
    this.renderer.setStyle(this.nowImage.nativeElement, 'background-image', 'url(' + this.images[this.nowImageIndex] + ')');
  }

  changeSubImage() {
    this.nowImageIndex += 1;
    this.renderer.setStyle(this.nowImage.nativeElement, 'background-image', 'url(' + this.images[this.nowImageIndex] + ')');
  }
}
