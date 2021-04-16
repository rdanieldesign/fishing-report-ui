import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import {
  delay,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { ILocation } from 'src/app/locations/interfaces/location.interface';
import { LocationAPIService } from 'src/app/locations/services/location-api.service';
import { FilterFields } from './filter.enum';
import { IFilter, IFilterOption } from './filter.interface';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  filterForm = new FormGroup({
    field: new FormControl(),
    value: new FormControl(),
  });

  private readonly destroy$ = new Subject();
  private readonly valueOptions$ = this.getValueOptions();
  private readonly fieldOptions$ = this.getFieldOptions();
  private readonly locationOptions$ = this.getLocationOptions();
  private readonly valueSearch$ = this.getControlSearch('value');
  private readonly fieldSearch$ = this.getControlSearch('field');
  private readonly filteredFieldOptions$ = this.getFilteredOptions(
    this.fieldSearch$,
    this.fieldOptions$
  );
  private readonly filteredValueOptions$ = this.getFilteredOptions(
    this.valueSearch$,
    this.valueOptions$
  );
  private readonly filters$ = new BehaviorSubject<IFilter[]>([]);
  private readonly formReset$ = new Subject();

  constructor(private readonly locationAPIService: LocationAPIService) {}

  getFieldControl() {
    return this.filterForm.get('field');
  }

  getFilteredFieldOptions() {
    return this.filteredFieldOptions$;
  }

  getFieldIsDisabled(): Observable<boolean> {
    return this.fieldOptions$.pipe(
      map((options: IFilterOption[]) =>
        Boolean(options && options.length === 1)
      )
    );
  }

  getValueControl() {
    return this.filterForm.get('value');
  }

  getFilteredValueOptions() {
    return this.filteredValueOptions$;
  }

  getValueIsDisabled(): Observable<boolean> {
    return this.valueOptions$.pipe(
      map((options: IFilterOption[]) =>
        Boolean(options && options.length === 1)
      )
    );
  }

  init(filters: IFilter[]) {
    this.getFieldControl()
      .valueChanges.pipe(
        filter((value) => typeof value !== 'string'),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.getValueControl().reset();
      });

    combineLatest([this.valueOptions$, this.formReset$])
      .pipe(
        map(([options]) => options),
        filter((options) => Boolean(options && options.length === 1)),
        delay(100),
        takeUntil(this.destroy$)
      )
      .subscribe((options) => {
        this.getValueControl().patchValue(options[0]);
      });

    combineLatest([this.fieldOptions$, this.formReset$])
      .pipe(
        map(([options]) => options),
        filter((options) => Boolean(options && options.length === 1)),
        delay(100),
        takeUntil(this.destroy$)
      )
      .subscribe((options) => {
        this.getFieldControl().patchValue(options[0]);
      });

    this.resetForm();
    this.filters$.next(filters);
  }

  addFilter() {
    const deduplicatedSelections = this.deduplicateSelection(
      this.filterForm.value,
      this.filters$.value
    );
    this.filters$.next(deduplicatedSelections);
    this.resetForm();
  }

  removeFilter(index: number) {
    const filters = [...this.filters$.value];
    filters.splice(index, 1);
    this.filters$.next(filters);
  }

  setFilters(filters: IFilter[]) {
    this.filters$.next(filters);
  }

  getFilters() {
    return this.filters$.asObservable();
  }

  getFiltersValue() {
    return this.filters$.value;
  }

  destroy() {
    this.destroy$.next();
  }

  private resetForm() {
    this.formReset$.next();
    this.filterForm.reset();
  }

  private getFilteredOptions(
    controlSearch$: Observable<string>,
    options$: Observable<IFilterOption[]>
  ): Observable<IFilterOption[]> {
    return combineLatest([controlSearch$, options$]).pipe(
      map(([search, options]) => {
        return search ? this.filter(search, options) : [...options];
      })
    );
  }

  private getControlSearch(controlName: string): Observable<string> {
    return this.filterForm.get(controlName).valueChanges.pipe(
      startWith(''),
      map((value) => {
        if (!value) return '';
        if (typeof value === 'string') return value;
        return value.label;
      })
    );
  }

  private getFieldOptions(): Observable<IFilterOption[]> {
    return of([
      {
        label: 'Location',
        value: FilterFields.Location,
      },
    ]);
  }

  private getValueOptions(): Observable<IFilterOption[]> {
    return this.getFieldControl().valueChanges.pipe(
      startWith(''),
      switchMap((field) => {
        if (typeof field === 'string' || field === null) {
          return of([]);
        } else {
          switch (field.value) {
            case FilterFields.Location: {
              return this.locationOptions$;
            }
            case FilterFields.Author:
            default: {
              return of([]);
            }
          }
        }
      })
    );
  }

  private getLocationOptions() {
    return this.locationAPIService.getAllLocations().pipe(
      map((locations: ILocation[]): IFilterOption[] => {
        return locations.map((location) => ({
          label: location.name,
          value: location.id,
        }));
      }),
      shareReplay(1)
    );
  }

  private filter(value: string, options: IFilterOption[]): IFilterOption[] {
    return options.filter((option) => {
      return option.label.toLowerCase().includes(value.trim().toLowerCase());
    });
  }

  private deduplicateSelection(
    selection: IFilter,
    existingList: IFilter[]
  ): IFilter[] {
    if (!selection) {
      return [...existingList];
    }
    if (!(existingList && existingList.length)) {
      return [{ ...selection }];
    }
    const matchingSelection = existingList.find((item) => {
      return (
        item.field.value === selection.field.value &&
        item.value.value === selection.value.value
      );
    });
    if (matchingSelection) {
      return [...existingList];
    }
    return [...existingList, { ...selection }];
  }
}
