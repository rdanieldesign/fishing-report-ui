// Copied verbatim from src/app/locations/interfaces/location.interface.ts — do not modify
export interface INewLocation {
  name: string;
  googleMapsLink: string;
}

export interface ILocation extends INewLocation {
  id: number;
}
