import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { IFileUpload } from './file-upload.interface';

@Pipe({
  name: 'imgSrc',
})
export class ImgSrcPipe implements PipeTransform {
  transform(file: IFileUpload): Observable<string> {
    if (file.imageURL) {
      return of(file.imageURL);
    }
    if (file.newFile) {
      const result = new Subject<string>();
      var reader = new FileReader();

      reader.onload = function (e) {
        result.next(reader.result as string);
      };

      reader.readAsDataURL(file.newFile);
      return result;
    }
  }
}
