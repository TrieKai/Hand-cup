import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import { DomService } from 'src/app/util/dom.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { LoginService } from 'src/app/service/login.service';
import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-re-auth',
  templateUrl: './re-auth.component.html',
  styleUrls: ['./re-auth.component.scss']
})
export class ReAuthComponent implements OnInit {
  @ViewChild('firstPage', { static: false }) firstPageRef: ElementRef<HTMLInputElement>;
  @ViewChild('secondPage', { static: false }) secondPageRef: ElementRef<HTMLInputElement>;
  @ViewChild('password', { static: false }) passwordRef: ElementRef<HTMLInputElement>;
  @ViewChild('newPassword', { static: false }) newPasswordRef: ElementRef<HTMLInputElement>;
  @ViewChild('confirmPassword', { static: false }) confirmPasswordRef: ElementRef<HTMLInputElement>;
  email: string;

  constructor(
    private domService: DomService,
    private sharedService: SharedService,
    private cons: ConstantsService,
    private loginService: LoginService,
    private renderer: Renderer2,
    private message: MessageService,
  ) { }

  ngOnInit() {
    this.email = this.loginService.getUserData().email;
  }

  closeDialog() {
    this.domService.destroyComponent(this.sharedService.getSharedData(this.cons.SHAREDDATA.reAuthComponentRef));
  }

  async confirm() {
    if (this.passwordRef.nativeElement.value === '' || this.passwordRef.nativeElement.value === null || this.passwordRef.nativeElement.value === undefined) {
      this.renderer.addClass(this.passwordRef.nativeElement, 'error');
      return;
    }
    const status = await this.loginService.reAuth(this.email, this.passwordRef.nativeElement.value);
    if (status) {
      this.renderer.addClass(this.firstPageRef.nativeElement, 'moveToLeft');
      this.renderer.addClass(this.secondPageRef.nativeElement, 'moveToLeft');
    }
  }

  async update() {
    const confirmPassword = this.confirmPasswordRef.nativeElement.value;
    const newPassword = this.newPasswordRef.nativeElement.value;
    if (newPassword === confirmPassword) {
      this.sharedService.setSharedData(this.cons.SHAREDDATA.onloading, true);
      await this.loginService.updatePasswordFireBase(confirmPassword)
        .then(() => {
          this.loginService.updatePassword(confirmPassword);
        });
      this.sharedService.setSharedData(this.cons.SHAREDDATA.onloading, false);
      this.domService.destroyComponent(this.sharedService.getSharedData(this.cons.SHAREDDATA.reAuthComponentRef));
    } else {
      this.renderer.addClass(this.newPasswordRef.nativeElement, 'error');
      this.renderer.addClass(this.confirmPasswordRef.nativeElement, 'error');
      this.message.add({ type: this.cons.MESSAGE_TYPE.error, title: '密碼不相符', content: '' });
    }
  }
}