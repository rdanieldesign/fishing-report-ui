import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { IFilterOption, IFilter } from './filter.interface';
import { FilterService } from './filter.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit, OnDestroy, OnChanges {
  @Input() appliedFilters: IFilter[] = [];

  @Output() apply = new EventEmitter<IFilter[]>();
  @Output() clearAll = new EventEmitter<void>();

  filteredFieldOptions$ = this.filterService.getFilteredFieldOptions();
  fieldControl = this.filterService.getFieldControl();
  fieldIsDisabled$ = this.filterService.getFieldIsDisabled();

  filteredValueOptions$ = this.filterService.getFilteredValueOptions();
  valueControl = this.filterService.getValueControl();
  valueIsDisabled$ = this.filterService.getValueIsDisabled();

  filters$ = this.filterService.getFilters();

  constructor(private readonly filterService: FilterService) {}

  ngOnInit(): void {
    this.filterService.init(this.appliedFilters);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes &&
      changes.appliedFilters &&
      !changes.appliedFilters.firstChange
    ) {
      this.filterService.setFilters(changes.appliedFilters.currentValue);
    }
  }

  ngOnDestroy() {
    this.filterService.destroy();
  }

  displayFn(selection: IFilterOption): string {
    return selection ? selection.label : '';
  }

  addFilter() {
    this.filterService.addFilter();
  }

  removeFilter(index: number) {
    this.filterService.removeFilter(index);
  }

  applyFilter() {
    this.apply.emit(this.filterService.getFiltersValue());
  }

  clearAllFilters() {
    this.clearAll.emit();
  }
}
