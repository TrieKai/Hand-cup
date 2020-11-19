import { Component, Input, OnInit } from '@angular/core';

import { DomService } from 'src/app/util/dom.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  @Input() closeButton: boolean = true;
  @Input() cancelButton: boolean = true;
  @Input() confirmButton: boolean = true;
  @Input() title: string;
  @Input() message: string;
  componentKey: string;
  confirmText: string;
  cancelText: string;

  constructor(
    private domService: DomService,
    private sharedService: SharedService,
    private cons: ConstantsService,
  ) { }

  ngOnInit() {
    this.confirmText = this.cons.CONFIRM_TEXT.confirm;
    this.cancelText = this.cons.CONFIRM_TEXT.cancel;
    this.componentKey = this.cons.SHAREDCOMPONENT.confirmComponentRef;
  }

  closeDialog() {
    this.domService.destroyComponent(this.sharedService.getSharedComponent(this.cons.SHAREDCOMPONENT.confirmComponentRef));
  }

  cancel() {
    this.sharedService.setStatus(this.cons.SHAREDSTATUS.isConfirm, false);
    this.closeDialog();
  }

  confirm() {
    this.sharedService.setStatus(this.cons.SHAREDSTATUS.isConfirm, true);
    this.closeDialog();
  }
}
