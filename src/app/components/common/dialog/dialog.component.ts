import { Component, OnInit, Input } from '@angular/core';

import { DomService } from 'src/app/util/dom.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  @Input() componentKey: string;

  constructor(
    private domService: DomService,
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
  }

  openUrl(url: string): void {
    window.open(url, '_blank');
  }

  closeDialog() {
    this.domService.destroyComponent(this.sharedService.getSharedComponent(this.componentKey));
  }
}
