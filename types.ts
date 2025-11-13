export type Coordinates = [number, number];

export interface Route {
  id: string;
  explorer: string;
  year: string;
  path: Coordinates[] | Coordinates[][];
  color: string;
  dash?: string;
  type: 'dotted' | 'dashed' | 'solid';
  description: string;
  consequences: string;
  keywords: string[];
  stops: { name: string; coords: Coordinates }[];
  explorerBio?: string;
  explorerImage?: string;
}

export interface City {
  name: string;
  coords: Coordinates;
}

export interface Empire {
    name: string;
    coords: Coordinates;
    description: string;
}

export interface Territory {
    name: string;
    power: string;
    color: string;
    strokeColor: string;
    countryCodes: string[]; // ISO 3166-1 alpha-3 codes
}

export interface Continent {
    name: string;
    coords: Coordinates;
    rotation?: number;
}