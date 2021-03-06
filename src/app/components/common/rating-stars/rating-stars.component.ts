import { Component, OnInit, Input, Pipe } from '@angular/core';

@Component({
  selector: 'app-rating-stars',
  templateUrl: './rating-stars.component.html',
  styleUrls: ['./rating-stars.component.scss']
})
export class RatingStarsComponent implements OnInit {
  @Input() rating: number;
  @Input() width: number = 15;
  @Input() height: number = 15;
  fullStars: number = 0;
  halfStars: number = 0;
  emptyStars: number = 0;

  constructor() { }

  ngOnInit() {
    this.handleRatingStar(this.rating);
  }

  handleRatingStar(rating: number) {
    const ratings: number = rating * 10 + 2; // 加二是因為好計算
    const ratingStars: number = Math.floor(ratings / 5) / 2; // 標準化成得到的星星數
    this.fullStars = Math.floor(ratingStars); // 滿星的數量
    this.halfStars = (ratingStars - this.fullStars) * 2; // 半星的數量
    this.emptyStars = 5 - this.fullStars - this.halfStars; // 空星的數量
  }
}
