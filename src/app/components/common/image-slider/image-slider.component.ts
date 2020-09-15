import { Component, OnInit, AfterViewInit, OnDestroy, Input, ViewChild, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss']
})
export class ImageSliderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('imageContainer', { static: false }) imageContainer: ElementRef<HTMLDivElement>;
  @ViewChild('image', { static: false }) image: ElementRef<HTMLDivElement>;
  @ViewChild('dotBox', { static: false }) dotBox: ElementRef<HTMLDivElement>;
  @Input() images: string[];
  @Input() customizeStyles: object[] = [];
  nowImageIndex: number = 0;
  listen: any;

  constructor(
    private renderer: Renderer2,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.changeImage(0);
    this.customizeStyles.forEach((style) => {
      this.renderer.setStyle(this.image.nativeElement, Object.keys(style)[0], Object.values(style)[0]);
    });
    this.listen = this.renderer.listen(this.imageContainer.nativeElement, 'mousewheel', (e: WheelEvent) => {
      e.deltaY > 0 ?
        this.changeImage(this.nowImageIndex + 1) : e.deltaY < 0 ?
          this.changeImage(this.nowImageIndex - 1) : null;
    });
  }

  ngOnDestroy(): void {
    this.listen();
  }

  getYPosition(e: Event): number {
    return (e.target as Element).scrollTop;
  }

  changeImage(index: any) {
    const imagesLength = this.images.length;
    index === -1
      ? index = imagesLength - 1 : index === imagesLength
        ? index = 0 : null;
    this.nowImageIndex = index;
    this.renderer.setStyle(this.image.nativeElement, 'background-image', 'url(' + this.images[index] + ')');
    this.dotBox.nativeElement.childNodes.forEach((dot, i) => {
      if (i === 0) { return; } // index 0 is ng-binding
      if (i - 1 === this.nowImageIndex) {
        this.renderer.addClass(dot.firstChild, 'active');
      } else {
        this.renderer.removeClass(dot.firstChild, 'active');
      }
    });
  }
}
