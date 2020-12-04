import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

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
  @Output() callback = new EventEmitter<boolean>();
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
    this.callback.emit(false);
    this.callback.complete();
  }

  confirm() {
    this.sharedService.setStatus(this.cons.SHAREDSTATUS.isConfirm, true);
    this.closeDialog();
    this.callback.emit(true);
    this.callback.complete();
  }
}
