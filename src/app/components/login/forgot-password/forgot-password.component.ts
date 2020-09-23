import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import { DomService } from 'src/app/util/dom.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  @ViewChild('email', { static: false }) emailRef: ElementRef<HTMLInputElement>;

  constructor(
    private domService: DomService,
    private sharedService: SharedService,
    private cons: ConstantsService,
    private loginService: LoginService,
    private renderer: Renderer2,
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.domService.destroyComponent(this.sharedService.getSharedData(this.cons.SHAREDDATA.forgotPasswordComponentRef));
  }

  async confirm() {
    const email = this.emailRef.nativeElement.value;
    if (email === '' || email === null || email === undefined) {
      this.renderer.addClass(this.emailRef.nativeElement, 'error');
      return;
    }
    this.sharedService.setSharedData(this.cons.SHAREDDATA.onloading, true);
    const status = await this.loginService.sendPasswordResetEmail(this.emailRef.nativeElement.value);
    this.sharedService.setSharedData(this.cons.SHAREDDATA.onloading, false);
    if (status) {
      this.domService.destroyComponent(this.sharedService.getSharedData(this.cons.SHAREDDATA.forgotPasswordComponentRef));
    }
  }
}
