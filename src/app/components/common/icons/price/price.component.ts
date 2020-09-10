import { Component, Input } from '@angular/core';

@Component({
  selector: 'i-price',
  templateUrl: './price.component.html',
  styleUrls: ['../icon.scss']
})
export class PriceComponent {
  @Input() size: number = 15;
  @Input() color: string = '#000000';
  @Input() opacity: number = 1;

  setStyle() {
    return {
      'font-size': this.size + 'px',
      'color': this.color,
      'opacity': this.opacity
    };
  }
}
