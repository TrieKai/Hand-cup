import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';

import { DomService } from 'src/app/util/dom.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { ProfileService } from 'src/app/service/profile.service';
import { UploadService } from 'src/app/util/upload.service';
import { LoginService } from 'src/app/service/login.service';
import { MessageService } from 'src/app/service/message.service';
import { CommonService } from 'src/app/service/common.service';

import { ImageEditorComponent } from '../common/image-editor/image-editor.component';
import { ReAuthComponent } from '../profile/re-auth/re-auth.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('imageEditor', { static: false }) imageEditor: ImageEditorComponent;
  @ViewChild('uploadInput', { static: false }) uploadInput: ElementRef<HTMLInputElement>;
  isLogin: boolean;
  name: string;
  email: string;
  photo: File = null;
  photoURL: string;
  subscribe: Subscription;
  imageLoaded: boolean;
  thirdParty: boolean;
  componentKey: string;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private domService: DomService,
    private sharedService: SharedService,
    private cons: ConstantsService,
    private profileService: ProfileService,
    private uploadService: UploadService,
    private loginService: LoginService,
    private message: MessageService,
    private renderer: Renderer2,
    private common: CommonService,
  ) { }

  ngOnInit() {
    this.subscribe = this.loginService.checkUserLoggedIn()
      .subscribe(status => {
        if (status === null) { return; }
        this.isLogin = status;
      });
    const userData = this.profileService.getUserData();
    this.name = userData.displayName;
    this.photoURL = userData.photoURL;
    const providerId = userData.providerData[0].providerId;
    if (providerId.indexOf(this.cons.SIGNUP_TYPE.google) === -1 && providerId.indexOf(this.cons.SIGNUP_TYPE.google) === -1) {
      this.thirdParty = false;
    } else {
      this.thirdParty = true;
    }
    this.componentKey = this.cons.SHAREDCOMPONENT.profileComponentRef;
  }

  ngOnDestroy(): void {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
  }

  imageOnload(event: boolean) {
    if (event) {
      this.renderer.removeClass(this.uploadInput.nativeElement, 'not-allowed');
      this.renderer.addClass(this.uploadInput.nativeElement, 'pointer');
      this.imageLoaded = event;
    }
  }

  async upload() {
    if (!this.imageLoaded) { return; }
    if (this.isLogin) {
      this.photo = await this.imageEditor.cropImage();
      if (this.photo) {
        const resp = await this.uploadService.uploadFile(this.cons.UPLOAD_TARGET_TYPE.profile, this.photo);
        if (!this.common.checkAPIResp(resp)) {
          this.message.add({ 'type': this.cons.MESSAGE_TYPE.error, 'title': '錯誤', 'content': '上傳照片發生錯誤' });
          return;
        }
        this.photoURL = resp;
        this.message.add({ 'type': this.cons.MESSAGE_TYPE.success, 'title': '成功', 'content': '上傳照片成功' });
      } else {
        this.message.add({ 'type': this.cons.MESSAGE_TYPE.warn, 'title': '警告', 'content': '請先選擇照片' });
      }
    } else {
      this.message.add({ 'type': this.cons.MESSAGE_TYPE.warn, 'title': '警告', 'content': '請先登入' });
    }
  }

  async confirm() {
    if (!this.isLogin) {
      this.message.add({ 'type': this.cons.MESSAGE_TYPE.warn, 'title': '警告', 'content': '請先登入' });
      return;
    }
    if (this.photoURL === '' || this.photoURL === null || this.photoURL === undefined) {
      console.log(this.photo)
      if (this.photo) {
        this.message.add({ 'type': this.cons.MESSAGE_TYPE.warn, 'title': '警告', 'content': '請先上傳照片' });
        return;
      }
      if (this.name === '' || this.name === null || this.name === undefined) {
        this.message.add({ 'type': this.cons.MESSAGE_TYPE.warn, 'title': '警告', 'content': '請填入資訊' });
        return;
      }
    }
    const userData: firebaseProfile = {
      displayName: this.name,
      photoURL: this.photoURL
    }
    this.sharedService.setStatus(this.cons.SHAREDSTATUS.onloading, true);
    await this.profileService.updateProfileFireBase(userData)
      .then(async () => {
        await this.profileService.updateProfile(this.name);
        this.domService.destroyComponent(this.sharedService.getSharedComponent(this.cons.SHAREDCOMPONENT.profileComponentRef));
      });
    this.sharedService.setStatus(this.cons.SHAREDSTATUS.onloading, false);
  }

  closeDialog() {
    this.domService.destroyComponent(this.sharedService.getSharedComponent(this.cons.SHAREDCOMPONENT.profileComponentRef));
  }

  reAuth() {
    if (!this.isLogin) {
      this.message.add({ 'type': this.cons.MESSAGE_TYPE.warn, 'title': '警告', 'content': '請先登入' });
      return;
    }
    const componentRef = this.domService.createComponent(ReAuthComponent, this.cons.SHAREDCOMPONENT.reAuthComponentRef);
    this.domService.attachComponent(componentRef, this.document.body);
  }

  async resendEmail() {
    await this.loginService.resendEmail();
  }
}
