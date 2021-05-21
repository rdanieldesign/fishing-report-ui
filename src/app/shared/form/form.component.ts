import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
} from '@angular/core';
import { MatFormField } from '@angular/material/form-field';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements AfterViewInit {
  @ContentChildren(MatFormField, { read: ElementRef })
  formFields: QueryList<ElementRef>;
  @Input() submitDisabled = false;
  @Input() loading = false;

  @Output() onSubmitClick = new EventEmitter();
  @Output() onCancelClick = new EventEmitter();

  constructor() {}

  ngAfterViewInit() {
    this.formFields.forEach((field) => {
      field.nativeElement.style.width = '100%';
    });
  }

  submit() {
    this.onSubmitClick.emit();
  }

  cancel() {
    this.onCancelClick.emit();
  }
}
