import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filter.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatChipsModule } from '@angular/material/chips';
import { FilterAsTextPipe } from './filter-as-text.pipe';

@NgModule({
  declarations: [FilterComponent, FilterAsTextPipe],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
    MatChipsModule,
  ],
  exports: [FilterComponent, FilterAsTextPipe],
})
export class FilterModule {}
