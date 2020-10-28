import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../util/material/material.module';

import { MessageComponent } from './message/message.component';
import { MessageBlockComponent } from './message/message-block/message-block.component';
import { LockLoadingComponent } from './lock-loading/lock-loading.component';
import { RatingStarsComponent } from './rating-stars/rating-stars.component';
import { DialogComponent } from './dialog/dialog.component';
import { ImageEditorComponent } from './image-editor/image-editor.component';
import { ImageSliderComponent } from './image-slider/image-slider.component';
import { SearchBoxComponent } from './search-box/search-box.component';
// icon
import { CloseComponent } from './icons/close/close.component';
import { DoneComponent } from './icons/done/done.component';
import { InfoComponent } from './icons/info/info.component';
import { WarningComponent } from './icons/warning/warning.component';
import { StarFullComponent } from './icons/star-full/star-full.component';
import { StarHalfComponent } from './icons/star-half/star-half.component';
import { StarEmptyComponent } from './icons/star-empty/star-empty.component';
import { PriceComponent } from './icons/price/price.component';
import { GoogleComponent } from './icons/google/google.component';
import { FacebookComponent } from './icons/facebook/facebook.component';

@NgModule({
  declarations: [
    MessageComponent,
    MessageBlockComponent,
    LockLoadingComponent,
    RatingStarsComponent,
    DialogComponent,
    ImageEditorComponent,
    ImageSliderComponent,
    CloseComponent,
    DoneComponent,
    InfoComponent,
    WarningComponent,
    StarFullComponent,
    StarHalfComponent,
    StarEmptyComponent,
    PriceComponent,
    GoogleComponent,
    FacebookComponent,
    SearchBoxComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    FormsModule,
    MessageComponent,
    LockLoadingComponent,
    RatingStarsComponent,
    DialogComponent,
    ImageEditorComponent,
    ImageSliderComponent,
    SearchBoxComponent,
    // icons
    CloseComponent,
    DoneComponent,
    InfoComponent,
    WarningComponent,
    StarFullComponent,
    StarHalfComponent,
    StarEmptyComponent,
    PriceComponent,
    GoogleComponent,
    FacebookComponent,
  ]
})
export class CommonComponentModule { }
