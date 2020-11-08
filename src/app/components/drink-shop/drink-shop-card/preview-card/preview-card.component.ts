import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-preview-card',
  templateUrl: './preview-card.component.html',
  styleUrls: ['./preview-card.component.scss']
})
export class PreviewCardComponent implements OnInit {
  @Input() chosenShop: drinkShopResults;
  @Input() chosenShopDetail: drinkShopDetail;
  ratingText: number | string;

  constructor() { }

  ngOnInit() {
    if (this.chosenShop.rating === 0) {
      this.ratingText = '尚未有評分'
    } else {
      this.ratingText = this.chosenShop.rating;
    }
  }
}
