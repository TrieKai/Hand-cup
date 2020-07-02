import { Component, Input } from '@angular/core';

@Component({
  selector: 'i-close',
  templateUrl: './close.component.html',
  styleUrls: ['../icon.scss']
})
export class CloseComponent {
  @Input() width: number = 24;
  @Input() height: number = 24;
  @Input() color: string = '#000000';
}
