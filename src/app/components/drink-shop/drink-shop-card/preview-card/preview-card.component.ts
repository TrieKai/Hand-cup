import { Component, OnInit, Input, Renderer2, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-preview-card',
  templateUrl: './preview-card.component.html',
  styleUrls: ['./preview-card.component.scss']
})
export class PreviewCardComponent implements OnInit, AfterViewInit {
  @ViewChild('image', { static: false }) imageRef: ElementRef<HTMLDivElement>;
  @Input() chosenShop: drinkShopResults;
  @Input() chosenShopDetail: drinkShopDetail;
  ratingText: number | string;

  constructor(
    private renderer: Renderer2,
  ) { }

  ngOnInit() {
    if (this.chosenShop.rating === 0) {
      this.ratingText = '尚未有評分'
    } else {
      this.ratingText = this.chosenShop.rating;
    }
  }

  ngAfterViewInit(): void {
    if (this.chosenShop.image_url) {
      this.renderer.setStyle(this.imageRef.nativeElement, 'background-image', 'url(' + this.chosenShop.image_url + ')');
    } else {
      this.renderer.setStyle(this.imageRef.nativeElement, 'background-color', '#2b2b2b');
      this.renderer.setStyle(this.imageRef.nativeElement, 'background-image', 'url(assets/icons/no-data.png)');
    }
  }
}
