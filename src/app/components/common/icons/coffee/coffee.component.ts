import { Component, Input } from '@angular/core';

@Component({
  selector: 'i-coffee',
  templateUrl: './coffee.component.html',
  styleUrls: ['../icon.scss']
})
export class CoffeeComponent {
  @Input() width: number = 24;
  @Input() height: number = 24;
  @Input() color: string = '#fff';
}
