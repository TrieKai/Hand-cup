import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-preview-card',
  templateUrl: './preview-card.component.html',
  styleUrls: ['./preview-card.component.scss']
})
export class PreviewCardComponent implements OnInit {
  @Input() chosenShop: drinkShopResults;
  @Input() chosenShopDetail: drinkShopDetail;

  constructor() { }

  ngOnInit() {
  }

}
