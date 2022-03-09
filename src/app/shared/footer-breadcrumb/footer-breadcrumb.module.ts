import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterBreadcrumbComponent } from './footer-breadcrumb.component';
import { SharedModule } from '../shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [FooterBreadcrumbComponent],
  imports: [CommonModule, SharedModule, RouterModule],
  exports: [FooterBreadcrumbComponent],
})
export class FooterBreadcrumbModule {}
