import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ILocation } from '../interfaces/location.interface';

@Injectable({
  providedIn: 'root'
})
export class LocationAPIService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getAllLocations(): Observable<ILocation[]> {
    return this.httpClient.get<ILocation[]>(`${environment.apiDomain}/api/locations`);
  }

}
