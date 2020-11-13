import { Component, Input, OnInit } from '@angular/core';

import { ConstantsService } from 'src/app/util/constants/constants.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  @Input() data: any;
  componentKey: string;

  constructor(
    private cons: ConstantsService,
  ) { }

  ngOnInit() {
    this.componentKey = this.cons.SHAREDDATA.reviewComponentRef;
  }

  openUrl(url: string): void {
    window.open(url, '_blank');
  }
}
