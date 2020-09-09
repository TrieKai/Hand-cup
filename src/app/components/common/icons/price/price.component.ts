import { Component, Input } from '@angular/core';

@Component({
  selector: 'i-price',
  templateUrl: './price.component.html',
  styleUrls: ['../icon.scss']
})
export class PriceComponent {
  @Input() width: number = 15;
  @Input() color: string = '#000000';
  @Input() opacity: number = 1;

  setStyle() {
    console.log(this.color)
    return {
      'font-size': this.width + 'px',
      'color': this.color,
      'opacity': this.opacity
    };
  }
}
