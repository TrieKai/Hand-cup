import { Component, OnInit } from '@angular/core';

import { DomService } from 'src/app/util/dom.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { ProfileService } from 'src/app/service/profile.service';
import { UploadService } from 'src/app/util/upload.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
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
  ) { }

  ngOnInit() {
  }

  loadImage(image: File) {
    console.log('loadImage: ', image)
    this.photo = image;
  }

  submit() {
    if (this.photo) {
      this.uploadService.uploadFile(this.cons.UPLOAD_TARGET_TYPE.profile, this.photo);
    }
  }

  confirm() {
    const userData: firebaseProfile = {
      displayName: this.name,
      // photoURL: null
    }
    this.profileService.updateProfile(userData);
  }

  closeDialog() {
    this.domService.destroyComponent(this.sharedService.getSharedData(this.cons.SHAREDDATA.profileComponentRef));
  }
}
