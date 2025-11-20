import type { Question } from '../types';

export const quizQuestions: Question[] = [
  {
    id: 1,
    text: "Ki volt az első európai, aki tengeri úton jutott el Indiába?",
    type: 'multiple-choice',
    category: 'Felfedezők',
    correctAnswer: "Vasco da Gama",
    options: ["Kolumbusz Kristóf", "Vasco da Gama", "Bartolomeu Diaz", "Ferdinand Magellán"],
    points: 10,
    timeLimit: 15
  },
  {
    id: 2,
    text: "Melyik évben érte el Kolumbusz Kristóf Amerikát?",
    type: 'multiple-choice',
    category: 'Dátumok',
    correctAnswer: "1492",
    options: ["1453", "1487", "1492", "1500"],
    points: 10,
    timeLimit: 10
  },
  {
    id: 3,
    text: "Magellán expedíciója volt az első, amely körbehajózta a Földet.",
    type: 'true-false',
    category: 'Felfedezők',
    correctAnswer: "Igaz",
    options: ["Igaz", "Hamis"],
    points: 5,
    timeLimit: 10
  },
  {
    id: 4,
    text: "Melyik szerződés osztotta fel az Újvilágot Spanyolország és Portugália között 1494-ben?",
    type: 'fill-in',
    category: 'Események' as any, // Using generic logic, mapped to Gyarmatok context usually
    correctAnswer: "Tordesillasi",
    hint: "T-vel kezdődik és egy spanyol városról kapta a nevét.",
    points: 20,
    timeLimit: 30
  },
  {
    id: 5,
    text: "Ki hódította meg az Azték Birodalmat?",
    type: 'multiple-choice',
    category: 'Gyarmatok',
    correctAnswer: "Hernán Cortés",
    options: ["Francisco Pizarro", "Hernán Cortés", "Amerigo Vespucci", "John Cabot"],
    points: 15,
    timeLimit: 15
  },
  {
    id: 6,
    text: "Melyik fokot kerülte meg Bartolomeu Diaz 1487-ben?",
    type: 'multiple-choice',
    category: 'Útvonalak',
    correctAnswer: "Jóreménység foka",
    options: ["Horn-fok", "Jóreménység foka", "Tű-fok", "Zöld-fok"],
    points: 10,
    timeLimit: 15
  },
  {
    id: 7,
    text: "Az Inka Birodalom a mai Mexikó területén helyezkedett el.",
    type: 'true-false',
    category: 'Gyarmatok',
    correctAnswer: "Hamis",
    options: ["Igaz", "Hamis"],
    points: 5,
    hint: "Gondolj az Andokra és Dél-Amerikára.",
    timeLimit: 10
  },
  {
    id: 8,
    text: "Kiről kapta a nevét Amerika?",
    type: 'multiple-choice',
    category: 'Felfedezők',
    correctAnswer: "Amerigo Vespucci",
    options: ["Amerigo Vespucci", "Amundsen", "Kolumbusz", "Amerika kapitány"],
    points: 10,
    timeLimit: 10
  },
  {
    id: 9,
    text: "Mit kerestek elsősorban a felfedezők Indiában?",
    type: 'multiple-choice',
    category: 'Útvonalak',
    correctAnswer: "Fűszereket",
    options: ["Selymet", "Fűszereket", "Rabszolgákat", "Fegyvereket"],
    points: 10,
    timeLimit: 15
  },
  {
    id: 10,
    text: "Francisco Pizarro hódította meg az Inka Birodalmat.",
    type: 'true-false',
    category: 'Gyarmatok',
    correctAnswer: "Igaz",
    options: ["Igaz", "Hamis"],
    points: 5,
    timeLimit: 10
  },
  {
    id: 11,
    text: "Melyik évben indult Magellán Föld körüli útjára?",
    type: 'multiple-choice',
    category: 'Dátumok',
    correctAnswer: "1519",
    options: ["1498", "1500", "1519", "1522"],
    points: 15,
    timeLimit: 15
  },
  {
    id: 12,
    text: "Hol halt meg Magellán az útja során?",
    type: 'multiple-choice',
    category: 'Felfedezők',
    correctAnswer: "Fülöp-szigetek",
    options: ["Brazília", "Fülöp-szigetek", "India", "Spanyolország"],
    points: 15,
    timeLimit: 15
  },
  {
    id: 13,
    text: "A tordesillasi szerződés értelmében Brazília Spanyolországhoz került.",
    type: 'true-false',
    category: 'Gyarmatok',
    correctAnswer: "Hamis",
    options: ["Igaz", "Hamis"],
    points: 10,
    hint: "Brazíliában portugálul beszélnek.",
    timeLimit: 15
  },
  {
    id: 14,
    text: "Melyik hajóval NEM utazott Kolumbusz az első útján?",
    type: 'multiple-choice',
    category: 'Felfedezők',
    correctAnswer: "Victoria",
    options: ["Santa Maria", "Pinta", "Niña", "Victoria"],
    points: 15,
    timeLimit: 20
  },
  {
    id: 15,
    text: "Egészítsd ki: Tenochtitlán az ______ Birodalom fővárosa volt.",
    type: 'fill-in',
    category: 'Gyarmatok',
    correctAnswer: "Azték",
    points: 20,
    timeLimit: 30
  },
  {
    id: 16,
    text: "Melyik évben fedezte fel Brazíliát Pedro Álvares Cabral?",
    type: 'multiple-choice',
    category: 'Dátumok',
    correctAnswer: "1500",
    options: ["1492", "1498", "1500", "1510"],
    points: 15,
    timeLimit: 15
  },
  {
    id: 17,
    text: "Melyik óceánt nevezte el Magellán 'Csendes'-nek?",
    type: 'multiple-choice',
    category: 'Útvonalak',
    correctAnswer: "Csendes-óceán",
    options: ["Atlanti-óceán", "Indiai-óceán", "Csendes-óceán", "Jeges-tenger"],
    points: 10,
    timeLimit: 10
  },
  {
    id: 18,
    text: "Mi volt a konkvisztádorok fő célja?",
    type: 'multiple-choice',
    category: 'Gyarmatok',
    correctAnswer: "Arany és dicsőség",
    options: ["Tudományos felfedezés", "Béke teremtése", "Arany és dicsőség", "Növények gyűjtése"],
    points: 10,
    timeLimit: 15
  },
  {
    id: 19,
    text: "Hány hajó tért vissza a 18 közül Magellán expedíciójából?",
    type: 'fill-in',
    category: 'Útvonalak',
    correctAnswer: "1",
    hint: "Csak a Victoria tért vissza.",
    points: 25,
    timeLimit: 20
  },
  {
    id: 20,
    text: "Vasco da Gama Afrika megkerülésével jutott el Kínába.",
    type: 'true-false',
    category: 'Útvonalak',
    correctAnswer: "Hamis",
    options: ["Igaz", "Hamis"],
    points: 5,
    hint: "Indiába jutott el.",
    timeLimit: 10
  }
];
