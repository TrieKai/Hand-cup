import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss']
})
export class ImageSliderComponent implements OnInit {
  @Input() width: number = 300;
  @Input() height: number = 300;
  @Input() images: string[];

  constructor() { }

  ngOnInit() {
  }

  containerStyles() {
    return {
      'width': this.width + 'px',
      'height': this.height + 'px'
    };
  }
}
