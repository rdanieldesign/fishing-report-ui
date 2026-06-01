export interface ICoordinates {
  latitude: number;
  longitude: number;
}

export interface INewLocation {
  name: string;
  coordinates: ICoordinates;
  usgsLocationId?: string | null;
}

export interface ILocation extends INewLocation {
  id: number;
  usgsLocationId?: string | null;
}
