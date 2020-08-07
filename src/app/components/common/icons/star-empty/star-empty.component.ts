import { Component, Input } from '@angular/core';

@Component({
  selector: 'i-star-empty',
  templateUrl: './star-empty.component.html',
  styleUrls: ['../icon.scss']
})
export class StarEmptyComponent {
  @Input() width: number = 15;
  @Input() height: number = 15;

  setStyle() {
    return {
      'width': this.width + 'px',
      'height': this.height + 'px'
    };
  }
}
