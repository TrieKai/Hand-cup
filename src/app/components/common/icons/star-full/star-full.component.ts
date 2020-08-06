import { Component, Input } from '@angular/core';

@Component({
  selector: 'i-star-full',
  templateUrl: './star-full.component.html',
  styleUrls: ['../icon.scss']
})
export class StarFullComponent {
  @Input() width: number = 15;
  @Input() height: number = 15;
}
