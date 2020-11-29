import { Component, OnInit, AfterViewInit, OnDestroy, OnChanges, Input, ViewChild, Renderer2, ElementRef, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss']
})
export class ImageSliderComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('imageContainer', { static: false }) imageContainerRef: ElementRef<HTMLDivElement>;
  @ViewChild('image', { static: false }) imageRef: ElementRef<HTMLDivElement>;
  @ViewChild('dotBox', { static: false }) dotBoxRef: ElementRef<HTMLDivElement>;
  @Input() images: string[] = [];
  @Input() links: string[] = [];
  @Input() customizeStyles: object[] = [];
  nowImageIndex: number = 0;
  listen: any;

  constructor(
    private renderer: Renderer2,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.images.isFirstChange()) {
      this.changeImage(0);
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.changeImage(0);
    if (this.imageRef) {
      this.customizeStyles.forEach((style) => {
        this.renderer.setStyle(this.imageRef.nativeElement, Object.keys(style)[0], Object.values(style)[0]);
      });
    }
    if (this.imageContainerRef) {
      this.listen = this.renderer.listen(this.imageContainerRef.nativeElement, 'mousewheel', (e: WheelEvent) => {
        e.deltaY > 0 ?
          this.changeImage(this.nowImageIndex + 1) : e.deltaY < 0 ?
            this.changeImage(this.nowImageIndex - 1) : null;
      });
    }
  }

  ngOnDestroy(): void {
    if (this.listen) { this.listen(); } // Remove listener
  }

  openLink() {
    const url = this.links[this.nowImageIndex].split('"')[1];
    window.open(url, '_blank');
  }

  changeImage(index: any) {
    const imagesLength = this.images.length;
    index === -1
      ? index = imagesLength - 1 : index === imagesLength
        ? index = 0 : null;
    this.nowImageIndex = index;
    if (this.imageRef) {
      this.renderer.setStyle(this.imageRef.nativeElement, 'background-image', 'url(' + this.images[index] + ')');
    }
    this.dotBoxRef.nativeElement.childNodes.forEach((dot, i) => {
      if (i === 0) { return; } // index 0 is ng-binding
      if (i - 1 === this.nowImageIndex) {
        this.renderer.addClass(dot.firstChild, 'active');
      } else {
        this.renderer.removeClass(dot.firstChild, 'active');
      }
    });
  }
}
