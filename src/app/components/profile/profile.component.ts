import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { DomService } from 'src/app/util/dom.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { ProfileService } from 'src/app/service/profile.service';
import { UploadService } from 'src/app/util/upload.service';
import { LoginService } from 'src/app/service/login.service';
import { MessageService } from 'src/app/service/message.service';
import { CheckService } from 'src/app/service/check.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  isLogin: boolean;
  name: string;
  email: string;
  photo: File = null;
  photoURL: string;
  subscribe: Subscription;
  onloading: boolean;

  constructor(
    private domService: DomService,
    private sharedService: SharedService,
    private cons: ConstantsService,
    private profileService: ProfileService,
    private uploadService: UploadService,
    private loginService: LoginService,
    private message: MessageService,
    private check: CheckService,
  ) { }

  ngOnInit() {
    this.subscribe = this.loginService.checkUserLoggedIn().subscribe(status => {
      console.log('profile service status: ', status)
      this.isLogin = status;
    });
    this.onloading = this.sharedService.getSharedData(this.cons.SHAREDDATA.onloading);
  }

  ngOnDestroy(): void {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
    this.sharedService.setSharedData(this.cons.SHAREDDATA.outputCanvas, false);
  }

  async loadImage(image: File) {
    console.log('loadImage: ', image)
    this.photo = image;
  }

  async upload() {
    console.log('isLogin: ', this.isLogin)
    this.sharedService.setSharedData(this.cons.SHAREDDATA.outputCanvas, true);
    if (this.isLogin) {
      if (this.photo) {
        const resp = await this.uploadService.uploadFile(this.cons.UPLOAD_TARGET_TYPE.profile, this.photo);
        if (!this.check.apiResult(resp)) {
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
    if (this.photoURL === '' || this.photoURL === null || this.photoURL === undefined) {
      if (this.photo) {
        this.message.add({ 'type': this.cons.MESSAGE_TYPE.warn, 'title': '警告', 'content': '請先上傳照片' });
        return;
      }
      if (this.name === '' || this.name === null || this.name === undefined) {
        return;
      }
    }
    const userData: firebaseProfile = {
      displayName: this.name,
      photoURL: this.photoURL
    }
    this.sharedService.setSharedData(this.cons.SHAREDDATA.onloading, true);
    await this.profileService.updateProfile(userData)
      .then(() => {
        this.domService.destroyComponent(this.sharedService.getSharedData(this.cons.SHAREDDATA.profileComponentRef));
      });
    this.sharedService.setSharedData(this.cons.SHAREDDATA.onloading, false);
  }

  closeDialog() {
    this.domService.destroyComponent(this.sharedService.getSharedData(this.cons.SHAREDDATA.profileComponentRef));
  }
}
