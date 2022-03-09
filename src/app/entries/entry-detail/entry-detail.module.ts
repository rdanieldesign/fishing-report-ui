import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryDetailRoutingModule } from './entry-detail-routing.module';
import { EntryDetailComponent } from './entry-detail.component';
import { SharedModule } from '../../shared/shared.module';
import { ConfirmModalModule } from 'src/app/confirm-modal/confirm-modal.module';
import { FooterBreadcrumbModule } from 'src/app/shared/footer-breadcrumb/footer-breadcrumb.module';

@NgModule({
  declarations: [EntryDetailComponent],
  imports: [
    CommonModule,
    EntryDetailRoutingModule,
    SharedModule,
    ConfirmModalModule,
    FooterBreadcrumbModule,
  ],
})
export class EntryDetailModule {}
