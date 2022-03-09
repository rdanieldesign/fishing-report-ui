import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterBreadcrumbComponent } from './footer-breadcrumb.component';

describe('FooterBreadcrumbComponent', () => {
  let component: FooterBreadcrumbComponent;
  let fixture: ComponentFixture<FooterBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterBreadcrumbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
