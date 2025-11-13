import type { Route, City, Empire, Territory, Coordinates, Continent } from '../types';

export const routes: Route[] = [
  {
    id: 'diaz',
    explorer: 'Bartolomeu Diaz',
    year: '1487',
    path: [
      [ -9.1393, 38.7223 ], // Lisbon
      [ -14.6, 17 ],
      [ -17.447, 14.716 ],
      [ 6, 4.5 ],
      [ 13, -4 ],
      [ 12, -15 ],
      [ 16, -26 ],
      [ 18.4241, -33.9249 ], // Cape of Good Hope
    ],
    color: '#00008B', // sötétkék
    type: 'solid',
    description: 'Bartolomeu Diaz volt az első európai, aki körbehajózta Afrika déli csücskét, a Jóreménység fokát, ezzel bizonyítva a kontinens megkerülhetőségét és megnyitva a potenciális tengeri utat India felé.',
    consequences: 'Bizonyította, hogy Afrika megkerülhető tengeren, ami a későbbi Vasco da Gama expedíció alapját képezte.',
    keywords: ['#Jóreménység', '#portugálok', '#IndiaFelé'],
    stops: [
      { name: 'Lisszabon', coords: [-9.1393, 38.7223] },
      { name: 'Jóreménység foka', coords: [18.4241, -33.9249] }
    ],
    explorerBio: 'Portugál tengerész és felfedező, aki elsőként hajózta körbe Afrika déli csücskét, a Jóreménység fokát. Ezzel megnyitotta az utat a későbbi tengeri expedíciók számára India felé.',
    explorerImage: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Bartolomeu_Dias_-_19th_century_engraving.jpg'
  },
  {
    id: 'columbus1',
    explorer: 'Kolumbusz Kristóf (1. út)',
    year: '1492',
    path: [
      [ -6.29, 36.53 ], // Cádiz/Palos
      [ -16.63, 28.29 ], // Canary Islands
      [ -61.5, 16.2 ],
      [ -74, 21 ], // Hispaniola
      [ -6.29, 36.53 ]
    ],
    color: '#228B22', // zöld
    type: 'dashed',
    description: 'Kolumbusz első útja az „Újvilágba”, melynek során a Kanári-szigetek érintésével átszelte az Atlanti-óceánt. Azt hitte, Indiába érkezett, de valójában a Karib-térséget fedezte fel.',
    consequences: 'Megnyitotta az utat az európai gyarmatosítás előtt Amerikában, és elindította a spanyol hódítások korszakát.',
    keywords: ['#Karib', '#Újvilág', '#spanyolkorona'],
    stops: [
      { name: 'Palos', coords: [-6.29, 36.53] },
      { name: 'Karib-szigetek', coords: [-68, 20] }
    ],
    explorerBio: 'Genovai származású tengerész, aki a spanyol korona szolgálatában felfedezte Amerikát, miközben nyugati útvonalat keresett Indiába. Bár soha nem ismerte el, hogy új kontinenst talált, útjai megváltoztatták a világtörténelmet.',
    explorerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Portrait_of_a_Man%2C_Said_to_be_Christopher_Columbus.jpg/800px-Portrait_of_a_Man%2C_Said_to_be_Christopher_Columbus.jpg'
  },
  {
    id: 'columbus_other',
    explorer: 'Kolumbusz további útjai',
    year: '1493-1504',
    path: [
       [-6.29, 36.53],
       [-61, 15], // Lesser Antilles
       [-71, 19], // Hispaniola
       [-77, 21], // Cuba
       [-80, 18], // Jamaica
       [-83, 15], // Central America coast
       [-6.29, 36.53]
    ],
    color: '#90EE90', // világoszöld
    type: 'dashed',
    description: 'További útjai során Kolumbusz felfedezte a Kis-Antillákat, Jamaicát és a közép-amerikai partvidéket, továbbra is abban a hitben, hogy Ázsia keleti részén jár.',
    consequences: 'Megerősítette a spanyol jelenlétet a régióban, és feltérképezte a Karib-térség jelentős részét.',
    keywords: ['#Karib', '#Újvilág', '#spanyolkorona'],
    stops: [
      { name: 'Kis-Antillák', coords: [-61, 15] },
      { name: 'Közép-Amerika', coords: [-83, 15] }
    ],
    explorerBio: 'Genovai származású tengerész, aki a spanyol korona szolgálatában felfedezte Amerikát, miközben nyugati útvonalat keresett Indiába. Bár soha nem ismerte el, hogy új kontinenst talált, útjai megváltoztatták a világtörténelmet.',
    explorerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Portrait_of_a_Man%2C_Said_to_be_Christopher_Columbus.jpg/800px-Portrait_of_a_Man%2C_Said_to_be_Christopher_Columbus.jpg'
  },
  {
    id: 'dagama',
    explorer: 'Vasco da Gama',
    year: '1497-1498',
    path: [
      [ -9.1393, 38.7223 ],
      [ -17, 14 ],
      [ 18.4241, -33.9249 ],
      [ 40, -14 ],
      [ 49, -10 ],
      [ 72.8777, 19.0760 ], // Goa-nearby coast
      [ 75, 11 ], // Calicut
    ],
    color: '#2E8B57', // kékeszöld
    type: 'solid',
    description: 'Vasco da Gama expedíciója volt az első, amely Afrikát megkerülve tengeri úton eljutott Európából Indiába, Kalikut városába.',
    consequences: 'Megnyitotta a közvetlen tengeri fűszerkereskedelmi utat, megtörve a velencei és arab monopóliumot, ami Portugália felemelkedéséhez vezetett.',
    keywords: ['#fűszerkereskedelem', '#India', '#portugálflotta'],
    stops: [
      { name: 'Lisszabon', coords: [-9.1393, 38.7223] },
      { name: 'Jóreménység foka', coords: [18.4241, -33.9249] },
      { name: 'Kalikut (India)', coords: [75.78, 11.25] }
    ],
    explorerBio: 'Portugál felfedező, aki elsőként jutott el Európából tengeri úton Indiába, megkerülve Afrikát. Expedíciója létrehozta a rendkívül jövedelmező fűszerkereskedelmi útvonalat, ami Portugáliát tengeri nagyhatalommá tette.',
    explorerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Vasco_da_Gama_-_1838.png/800px-Vasco_da_Gama_-_1838.png'
  },
  {
    id: 'magellan',
    explorer: 'Fernão de Magalhães',
    year: '1519-1522',
    path: [
      // 1. Sevilla → Dél-Amerika
      [ [-6.29, 36.53], [-25, 15], [-45, -15], [-60, -35], [-68, -53] ],
      // 2. Magellán-szoros → Csendes-óceán (keleti fele)
      [ [-68, -53], [-90, -40], [-120, -20], [-150, -15], [-179, -12] ],
      // 3. Csendes-óceán (nyugati fele) → Fülöp-szigetek
      [ [179, -12], [160, 0], [140, 8], [125, 10] ],
      // 4. Fülöp-szigetek → Indonézia
      [ [125, 10], [122, 5], [120, 0] ],
      // 5. Indonézia → Spanyolország
      [ [120, 0], [100, -10], [80, -20], [40, -30], [18.4241, -33.9249], [0, 0], [-15, 15], [-6.29, 36.53] ]
    ],
    color: '#FF0000', // piros
    type: 'dotted',
    description: 'Magellán expedíciója hajtotta végre az első sikeres Föld körüli utat. Bár a kapitány a Fülöp-szigeteken életét vesztette, egy hajója visszatért Spanyolországba.',
    consequences: 'Gyakorlatban is bizonyította a Föld gömbölyű alakját és feltárta a Csendes-óceán hatalmas kiterjedését.',
    keywords: ['#Földkörüliút', '#Csendesóceán', '#spanyol'],
    stops: [
      { name: 'Spanyolország', coords: [-6.29, 36.53] },
      { name: 'Magellán-szoros', coords: [-68, -53] },
      { name: 'Fülöp-szigetek', coords: [125, 10] },
      { name: 'Jóreménység foka', coords: [18.4241, -33.9249] }
    ],
    explorerBio: 'Portugál származású felfedező, aki spanyol szolgálatban vezette az első expedíciót a Föld körülhajózására. Bár az út során életét vesztette a Fülöp-szigeteken, flottája bizonyította, hogy a Föld gömbölyű, és a Csendes-óceánon át is elérhető Ázsia.',
    explorerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Ferdinand_Magellan_by_Charles_Legrand_c.1850.jpg/800px-Ferdinand_Magellan_by_Charles_Legrand_c.1850.jpg'
  },
  {
    id: 'vespucci',
    explorer: 'Amerigo Vespucci',
    year: '1499-1502',
    path: [
      [-9.1393, 38.7223], // Lisbon
      [-23.6, 15.1],   // Near Cape Verde
      [-35, -5],     // Brazil coast start
      [-45, -15],
      [-43, -23],    // Brazil coast end
      [-20, 10],     // Mid-Atlantic return
      [-9.1393, 38.7223], // Lisbon
    ],
    color: '#4B0082', // Indigo
    type: 'dashed',
    description: 'Olasz származású, spanyol és portugál szolgálatban álló hajós, aki több dél-amerikai part menti expedíció során felismerte, hogy az újonnan felfedezett földrészek nem Ázsiához tartoznak, hanem egy teljesen új kontinensről van szó.',
    consequences: 'Nevéről kapta a nevét az „Amerika” elnevezés, amelyet később a kontinensekre általánosan használtak.',
    keywords: ['#Újvilág', '#Amerika', '#kontinens'],
    stops: [
      { name: 'Lisszabon', coords: [-9.1393, 38.7223] },
      { name: 'Brazília partvidéke', coords: [-40, -10] },
    ],
    explorerBio: 'Olasz származású, spanyol és portugál szolgálatban álló hajós, aki több dél-amerikai part menti expedíció során felismerte, hogy az újonnan felfedezett földrészek nem Ázsiához tartoznak, hanem egy teljesen új kontinensről van szó.',
    explorerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Amerigo_Vespucci_by_Bronzino_c._1545.jpg/800px-Amerigo_Vespucci_by_Bronzino_c._1545.jpg',
  },
  {
    id: 'cortez',
    explorer: 'Hernán Cortés',
    year: '1519-1521',
    path: [
      [-95.19, 19.17], // Veracruz
      [-97, 19.3],
      [-98.73, 19.69], // Teotihuacan area
      [-99.13, 19.43] // Tenochtitlan
    ],
    color: '#FF69B4', // rózsaszín
    type: 'solid',
    description: 'Cortés vezette a spanyol konkvisztádorokat, akik megdöntötték a hatalmas Azték Birodalmat és elfoglalták fővárosát, Tenochtitlánt.',
    consequences: 'Létrehozta Új-Spanyolország alkirályságot, megindította a közép-amerikai ezüstbányászatot, és katasztrofális járványokat hozott az őslakosokra.',
    keywords: ['#Azték', '#Konkvisztádor', '#ÚjSpanyolország'],
    stops: [
       { name: 'Veracruz', coords: [-95.19, 19.17] },
       { name: 'Tenochtitlan (Mexikóváros)', coords: [-99.13, 19.43] }
    ],
    explorerBio: 'Spanyol konkvisztádor, aki az Azték Birodalom meghódításával vált hírhedtté. Vakmerő stratégiájával és a helyi ellentétek kihasználásával megdöntötte Montezuma uralmát, és megalapította Új-Spanyolországot.',
    explorerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Portrait_of_Hern%C3%A1n_Cort%C3%A9s.jpg/800px-Portrait_of_Hern%C3%A1n_Cort%C3%A9s.jpg'
  },
  {
    id: 'pizarro',
    explorer: 'Francisco Pizarro',
    year: '1530-1534',
    path: [
      [-80.6, -2.2], // Tumbes
      [-79, -5],
      [-78.5, -8.1], // Cajamarca
      [-77.04, -12.04] // Cuzco
    ],
    color: '#A0522D', // barna
    type: 'solid',
    description: 'Pizarro a spanyol hódítók egy kis csoportjával meghódította az Inka Birodalmat az Andok hegyei között.',
    consequences: 'Spanyolország számára óriási vagyont (aranyat és ezüstöt) biztosított, hozzájárulva a Potosí bányaváros felvirágzásához, miközben az inka civilizációt lerombolta.',
    keywords: ['#Inka', '#Andok', '#Potosí'],
    stops: [
       { name: 'Tumbes', coords: [-80.6, -2.2] },
       { name: 'Cajamarca', coords: [-78.5, -8.1] },
       { name: 'Cuzco', coords: [-77.04, -12.04] }
    ],
    explorerBio: 'Spanyol konkvisztádor, aki maroknyi emberével meghódította a hatalmas Inka Birodalmat Peruban. Csellel elfogta és kivégeztette Atahualpa inka uralkodót, majd megszerezte a birodalom mesés kincseit Spanyolország számára.',
    explorerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Pizarro.jpg/800px-Pizarro.jpg'
  },
  {
    id: 'tordesillas',
    explorer: 'Tordesillasi szerződés',
    year: '1494',
    path: [[-46.6, 60], [-46.6, -60]],
    color: '#8B0000', // Dark Red
    type: 'dashed',
    description: 'A Tordesillasi szerződés a spanyol és a portugál korona között jött létre, hogy felosszák az újonnan felfedezett Európán kívüli területeket. Egy demarkációs vonalat húztak az Atlanti-óceánon keresztül, a Zöld-foki szigetektől 370 leaguára nyugatra.',
    consequences: 'A vonaltól nyugatra eső területek Spanyolországot, a keletre esőek pedig Portugáliát illették meg. Ez a felosztás alapvetően meghatározta Dél-Amerika gyarmatosítását, Brazília portugál, a többi terület pedig spanyol nyelvűvé válását eredményezve.',
    keywords: ['#szerződés', '#Spanyolország', '#Portugália', '#felosztás'],
    stops: [],
  },
];

export const cities: City[] = [
    { name: 'Lisszabon', coords: [-9.1393, 38.7223] },
    { name: 'Cádiz', coords: [-6.2922, 36.5298] },
    { name: 'Sevilla', coords: [-5.9845, 37.3886] },
    { name: 'Párizs', coords: [2.3522, 48.8566] },
    { name: 'London', coords: [-0.1278, 51.5074] },
    { name: 'Amszterdam', coords: [4.8952, 52.3702] },
    { name: 'Velence', coords: [12.3155, 45.4408] },
    { name: 'Konstantinápoly', coords: [28.9784, 41.0082] },
    { name: 'Goa', coords: [73.8278, 15.4909] },
    { name: 'Makaó', coords: [113.5439, 22.1987] },
    { name: 'Tokió', coords: [139.6917, 35.6895] },
    { name: 'Tenochtitlán', coords: [-99.13, 19.43] },
    { name: 'Cuzco', coords: [-77.04, -12.04] },
];

export const empires: Empire[] = [
    { name: 'Azték Birodalom', coords: [-99.13, 19.43], description: 'A hatalmas Mezoamerikai birodalom, melynek központja Tenochtitlán volt. Híresek voltak fejlett mezőgazdaságukról és monumentális építészetükről.' },
    { name: 'Inka Birodalom', coords: [-77.04, -12.04], description: 'Az Andok hegyvonulatai mentén elterülő, kiterjedt birodalom, melyet egyedülálló úthálózat és közigazgatás jellemzett.' },
    { name: 'Maja Civilizáció', coords: [-89.62, 20.68], description: 'Fejlett civilizáció a Yucatán-félszigeten, melyet a csillagászatban, matematikában és írásban elért eredményeik tettek híressé.' },
];

export const territories: Territory[] = [
    { name: 'Spanyol', power: 'Spanyolország', color: 'rgba(255, 153, 153, 0.5)', strokeColor: '#d12e2e', countryCodes: ['MEX', 'GTM', 'HND', 'SLV', 'NIC', 'CRI', 'PAN', 'COL', 'VEN', 'ECU', 'PER', 'BOL', 'CHL', 'ARG', 'PRY', 'URY', 'CUB', 'DOM', 'PRI'] },
    { name: 'Portugál', power: 'Portugália', color: 'rgba(153, 179, 255, 0.5)', strokeColor: '#3662d9', countryCodes: ['BRA', 'AGO', 'MOZ'] },
    { name: 'Angol', power: 'Anglia', color: 'rgba(153, 230, 153, 0.5)', strokeColor: '#2d8f2d', countryCodes: ['USA', 'CAN'] }, // Early settlements
    { name: 'Francia', power: 'Franciaország', color: 'rgba(201, 163, 255, 0.5)', strokeColor: '#8a4ddb', countryCodes: ['CAN'] }, // Early explorations
    { name: 'Holland', power: 'Hollandia', color: 'rgba(255, 204, 153, 0.5)', strokeColor: '#e0861e', countryCodes: ['IDN', 'SUR'] }
];

export const continents: Continent[] = [
    { name: 'Észak-Amerika', coords: [-100, 45], rotation: -30 },
    { name: 'Dél-Amerika', coords: [-60, -15], rotation: -30 },
    { name: 'Európa', coords: [15, 55], rotation: 0 },
    { name: 'Afrika', coords: [20, 5], rotation: 0 },
    { name: 'Ázsia', coords: [90, 50], rotation: 0 },
    { name: 'Ausztrália', coords: [135, -25], rotation: 0 },
    { name: 'Antarktisz', coords: [0, -80], rotation: 0 },
];

export const oceans: Continent[] = [
    { name: 'Csendes-óceán', coords: [-140, 10] },
    { name: 'Atlanti-óceán', coords: [-30, 20] },
    { name: 'Indiai-óceán', coords: [80, -10] },
];