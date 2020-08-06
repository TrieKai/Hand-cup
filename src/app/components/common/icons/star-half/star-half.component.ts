import { Component, Input } from '@angular/core';

@Component({
  selector: 'i-star-half',
  templateUrl: './star-half.component.html',
  styleUrls: ['../icon.scss']
})
export class StarHalfComponent {
  @Input() width: number = 15;
  @Input() height: number = 15;
}
