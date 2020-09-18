import { Component, Input } from '@angular/core';

@Component({
  selector: 'i-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['../icon.scss']
})
export class FacebookComponent {
  @Input() width: number = 20;
  @Input() height: number = 20;
  @Input() color: string = '#FFFFFF';
}