import { Component, OnInit, Input, Pipe } from '@angular/core';

@Pipe({
  name: 'range'
})
@Component({
  selector: 'app-rating-stars',
  templateUrl: './rating-stars.component.html',
  styleUrls: ['./rating-stars.component.scss']
})
export class RatingStarsComponent implements OnInit {
  @Input() rating: number;
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
    const fullStars: number = Math.floor(ratingStars); // 滿星的數量
    const halfStars: number = (ratingStars - fullStars) * 2; // 半星的數量
    const emptyStars: number = 5 - fullStars - halfStars; // 空星的數量

    console.log(fullStars, halfStars, emptyStars)
    for (let i: number = 0; i < fullStars; i++) {
      this.fullStars++;
    }
    if (halfStars) {
      this.halfStars++;
    }
    if (emptyStars) {
      for (let i: number = 0; i < emptyStars; i++) {
        this.emptyStars++;
      }
    }
  }
}
