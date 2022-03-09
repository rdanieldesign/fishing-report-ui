import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-breadcrumb',
  templateUrl: './footer-breadcrumb.component.html',
  styleUrls: ['./footer-breadcrumb.component.css'],
})
export class FooterBreadcrumbComponent {
  @Input() text: string;
  @Input() link: string[];
}
