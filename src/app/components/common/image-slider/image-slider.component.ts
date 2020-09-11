import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss']
})
export class ImageSliderComponent implements OnInit {
  @ViewChild('image', { static: false }) image: ElementRef<HTMLDivElement>;
  @ViewChild('dotBox', { static: false }) dotBox: ElementRef<HTMLDivElement>;
  @Input() width: number = 300;
  @Input() height: number = 300;
  @Input() images: string[];
  nowImageIndex: number = 0;

  constructor(
    private renderer: Renderer2,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.changeImage(0);
  }

  containerStyles(): object {
    return {
      'width': this.width + 'px',
      'height': this.height + 'px'
    };
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
