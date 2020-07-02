import { Component, Input } from '@angular/core';

@Component({
  selector: 'i-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['../icon.scss']
})
export class WarningComponent {
  @Input() width: number = 24;
  @Input() height: number = 24;
  @Input() color: string = '#000000';
}
