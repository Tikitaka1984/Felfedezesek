export type Coordinates = [number, number];

export type EmpireId = 'spain' | 'portugal' | 'england' | 'france' | 'netherlands';

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
    id: EmpireId;
    name: string;
    power: string;
    countryNames: string[]; // Full country names from world-atlas
}

export interface Continent {
    name: string;
    coords: Coordinates;
    rotation?: number;
}