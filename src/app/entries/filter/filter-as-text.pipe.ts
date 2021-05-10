import { Pipe, PipeTransform } from '@angular/core';
import { IFilter } from './filter.interface';

@Pipe({
  name: 'filterAsText',
})
export class FilterAsTextPipe implements PipeTransform {
  transform(filter: IFilter | IFilter[]): string {
    if (!filter) {
      return '';
    }
    if ((filter as IFilter[]).length) {
      return (filter as IFilter[]).reduce(
        (label: string, filter: IFilter): string => {
          if (label) {
            return `${label}, ${this.getFilterLabel(filter)}`;
          }
          return this.getFilterLabel(filter);
        },
        ''
      );
    }
    return this.getFilterLabel(filter as IFilter);
  }

  private getFilterLabel(filter: IFilter): string {
    if (!(filter.field && filter.value)) {
      return '';
    }
    return `${filter.field.label}: ${filter.value.label}`;
  }
}
