import { Component, Input } from '@angular/core';

@Component({
  selector: 'i-done',
  templateUrl: './done.component.html',
  styleUrls: ['../icon.scss']
})
export class DoneComponent {
  @Input() width: number = 24;
  @Input() height: number = 24;
  @Input() color: string = '#000000';
}
