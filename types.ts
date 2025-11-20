
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

export type ConceptCategory = 'Felfedező' | 'Útvonal' | 'Gyarmat' | 'Esemény' | 'Város' | 'Egyéb';

export interface Concept {
  id: string;
  name: string;
  definition: string;
  category: ConceptCategory;
  year?: string | number;
  createdAt: number;
}

// --- QUIZ TYPES ---

export type QuestionType = 'multiple-choice' | 'true-false' | 'fill-in';
export type QuestionCategory = 'Felfedezők' | 'Útvonalak' | 'Gyarmatok' | 'Dátumok';

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  category: QuestionCategory;
  correctAnswer: string;
  options?: string[]; // For multiple choice
  points: number;
  hint?: string;
  timeLimit: number; // seconds
}

export interface QuizResult {
  totalScore: number;
  maxScore: number;
  correctCount: number;
  totalQuestions: number;
  categoryScores: Record<QuestionCategory, { correct: number; total: number }>;
  completedAt: number;
}
