import { Component, OnInit, Inject, Input } from '@angular/core';
// import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
    // @Inject(MAT_DIALOG_DATA) public data: any
    private domService: DomService,
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
    // console.log(this.data)
  }

  openUrl(url: string): void {
    window.open(url, '_blank');
  }

  closeDialog() {
    console.log(this.componentKey)
    this.domService.destroyComponent(this.sharedService.getSharedData(this.componentKey));
  }
}
