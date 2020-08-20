import { Component, OnInit } from '@angular/core';

import { DomService } from 'src/app/util/dom.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  name: string;
  phoneNumber: number;

  constructor(
    private domService: DomService,
    private sharedService: SharedService,
    private cons: ConstantsService,
  ) { }

  ngOnInit() {
  }

  confirm() {

  }

  closeDialog() {
    this.domService.destroyComponent(this.sharedService.getSharedData(this.cons.SHAREDDATA.settingsComponentRef));
  }
}
