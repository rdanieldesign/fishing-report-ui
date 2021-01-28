import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from './confirm-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ConfirmModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    SharedModule,
  ],
  exports: [
    MatDialogModule,
  ]
})
export class ConfirmModalModule { }
