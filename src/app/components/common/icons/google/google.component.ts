import { Component, Input } from '@angular/core';

@Component({
  selector: 'i-google',
  templateUrl: './google.component.html',
  styleUrls: ['../icon.scss']
})
export class GoogleComponent {
  @Input() width: number = 20;
  @Input() height: number = 20;
}