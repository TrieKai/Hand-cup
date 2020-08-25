import { Component, OnInit } from '@angular/core';

import { DomService } from 'src/app/util/dom.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { ProfileService } from 'src/app/service/profile.service';
import { UploadService } from 'src/app/util/upload.service';
import { LoginService } from 'src/app/service/login.service';
import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  isLogin: boolean;
  name: string;
  email: string;
  phoneNumber: string;
  photo: File = null;
  photoURL: string;

  constructor(
    private domService: DomService,
    private sharedService: SharedService,
    private cons: ConstantsService,
    private profileService: ProfileService,
    private uploadService: UploadService,
    private loginService: LoginService,
    private message: MessageService,
  ) {
    this.loginService.checkUserLoggedIn().subscribe(status => {
      this.isLogin = status;
    });
  }

  ngOnInit() {
  }

  loadImage(image: File) {
    console.log('loadImage: ', image)
    this.photo = image;
  }

  async submit() {
    if (this.isLogin) {
      if (this.photo) {
        this.photoURL = await this.uploadService.uploadFile(this.cons.UPLOAD_TARGET_TYPE.profile, this.photo);
      } else {
        this.message.add({ 'type': this.cons.MESSAGE_TYPE.warn, 'title': '警告', 'content': '請先選擇照片' });
      }
    } else {
      this.message.add({ 'type': this.cons.MESSAGE_TYPE.warn, 'title': '警告', 'content': '請先登入' });
    }
  }

  confirm() {
    const userData: firebaseProfile = {
      displayName: this.name,
      photoURL: this.photoURL
    }
    this.profileService.updateProfile(userData);
  }

  closeDialog() {
    this.domService.destroyComponent(this.sharedService.getSharedData(this.cons.SHAREDDATA.profileComponentRef));
  }
}
