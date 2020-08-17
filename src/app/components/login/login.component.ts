import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { DomService } from 'src/app/util/dom.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Output() close = new EventEmitter();

  constructor(
    private domService: DomService,
    private sharedService: SharedService,
    private cons: ConstantsService,
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.domService.destroyComponent(this.sharedService.getSharedData(this.cons.SHAREDDATA.loginComponentRef));
  }
}
