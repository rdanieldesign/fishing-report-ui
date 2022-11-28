import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  Optional,
  Self,
} from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { BehaviorSubject, Subject } from 'rxjs';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  providers: [
    { provide: MatFormFieldControl, useExisting: FileUploadComponent },
  ],
})
export class FileUploadComponent
  implements OnInit, ControlValueAccessor, MatFormFieldControl<FileList>
{
  @HostBinding() id = `file-upload-component-${FileUploadComponent.nextId++}`;

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  private _placeholder: string;

  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _disabled = false;

  get errorState(): boolean {
    return false;
  }
  controlType = 'file-upload';
  value: FileList;
  stateChanges = new Subject<void>();
  focused = false;
  touched = false;
  get empty() {
    return !this.value;
  }
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }
  static nextId = 0;
  loading = new BehaviorSubject<boolean>(false);

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private _elementRef: ElementRef
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.stateChanges.complete();
  }

  onFileChange(e: FileList) {
    console.log(e);
    this.value = e;
    this.loading.next(false);
    this.stateChanges.next();
    this.onChange(this.value);
  }

  onChange = (file: FileList) => {};

  onTouched = () => {
    console.log('touched');
  };

  onAddClick() {
    this.loading.next(true);
  }

  onFocusIn(event: FocusEvent) {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  onFocusOut(event: FocusEvent) {
    this.loading.next(false);
    if (
      !this._elementRef.nativeElement.contains(event.relatedTarget as Element)
    ) {
      this.touched = true;
      this.focused = false;
      this.onTouched();
      this.stateChanges.next();
    }
  }

  writeValue(files: FileList) {
    this.value = files;
    this.stateChanges.next();
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    console.log('mark touched');
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
    this.stateChanges.next();
  }

  setDescribedByIds(ids: string[]) {}

  onContainerClick(event: MouseEvent) {
    this.focused = true;
  }
}
