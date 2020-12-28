import { Component, Input } from '@angular/core';

@Component({
  selector: 'i-cloud',
  templateUrl: './cloud.component.html',
  styleUrls: ['../icon.scss']
})
export class CloudComponent {
  @Input() color: string = '#ffffff';
}
