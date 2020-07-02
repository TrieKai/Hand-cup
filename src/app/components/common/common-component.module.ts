import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../util/material/material.module';

import { MessageComponent } from './message/message.component';
import { MessageBlockComponent } from './message/message-block/message-block.component';
// icon
import { CloseComponent } from './icons/close/close.component';
import { DoneComponent } from './icons/done/done.component';
import { InfoComponent } from './icons/info/info.component';
import { WarningComponent } from './icons/warning/warning.component';
import { LockLoadingComponent } from './lock-loading/lock-loading.component';

@NgModule({
  declarations: [
    MessageComponent,
    MessageBlockComponent,
    CloseComponent,
    DoneComponent,
    InfoComponent,
    WarningComponent,
    LockLoadingComponent
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
    // icons
    CloseComponent,
    DoneComponent,
    InfoComponent,
    WarningComponent
  ]
})
export class CommonComponentModule { }
