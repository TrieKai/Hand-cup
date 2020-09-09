import { Component, OnInit, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-preview-card',
  templateUrl: './preview-card.component.html',
  styleUrls: ['./preview-card.component.scss']
})
export class PreviewCardComponent implements OnInit, OnChanges {
  @Input() chosenShop: drinkShopResults;
  @Input() chosenShopDetail: drinkShopDetail;
  rating: number;

  constructor() { }

  ngOnInit() {
    console.log('i', this.rating)
  }

  ngOnChanges(changes: SimpleChanges) {
    this.rating = null;
    const currentItem: SimpleChange = changes.chosenShopDetail;
    const chosenShopDetail: drinkShopDetail = currentItem.currentValue;
    this.rating = chosenShopDetail.reviews[0].rating;
    console.log('c', this.rating)
  }
}
