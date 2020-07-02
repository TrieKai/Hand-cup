import { Component, Input } from '@angular/core';

@Component({
  selector: 'i-info',
  templateUrl: './info.component.html',
  styleUrls: ['../icon.scss']
})
export class InfoComponent {
  @Input() width: number = 24;
  @Input() height: number = 24;
  @Input() color: string = '#000000';
}
