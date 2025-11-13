import React, { useState } from 'react';

interface EducationalPanelProps {
  selectedExplorerId: string | null;
  onClose: () => void;
}

const explorerInfo: { [key: string]: { name: string; description: string; significance: string[] } } = {
  diaz: {
    name: 'Bartolomeu Diaz (1487)',
    description: 'Portugál felfedező, aki 1487–1488-ban első európaiként megkerülte Afrika déli csúcsát, a Jóreménység fokát.',
    significance: [
      'Bizonyította, hogy az Atlanti-óceán összeköttetésben áll az Indiai-óceánnal.',
      'Megnyitotta az utat a portugálok számára India felé.',
      'Előkészítette Vasco da Gama sikeres indiai útját.',
    ],
  },
  columbus1: {
    name: 'Kolumbusz Kristóf – 1. út (1492)',
    description: 'Genovai származású, spanyol szolgálatban hajózó felfedező, aki 1492-ben nyugat felé indulva érte el az amerikai kontinens térségét.',
    significance: [
        'Megnyitotta az utat Amerika európai felfedezése és gyarmatosítása felé.',
        'A Karib-térség szigeteinek (San Salvador, Kuba, Hispaniola) feltárásával új kereskedelmi lehetőségek nyíltak.',
        'Alapvetően megváltoztatta az európaiak világképét a Föld méretéről és kontinenseiről.',
    ],
  },
  columbus_other: {
    name: 'Kolumbusz további útjai (1493–1504)',
    description: 'Kolumbusz további három útja során számos karibi szigetet és Közép-Amerika partvidékét térképezte fel.',
    significance: [
      'Pontosította a „Újvilág” partvonalát.',
      'Hozzájárult a spanyol gyarmati közigazgatás kialakulásához az Antillákon.',
      'Megerősítette, hogy az újonnan felfedezett területek tartósan bekapcsolhatók az európai kereskedelembe.',
    ],
  },
  dagama: {
    name: 'Vasco da Gama (1497–1499)',
    description: 'Portugál felfedező, az első, aki Afrika megkerülésével, Jóreménység foka érintésével jutott el Indiába (Kalikut).',
    significance: [
        'Létrehozta az első közvetlen tengeri kereskedelmi útvonalat Európa és India között.',
        'Lehetővé tette, hogy Portugália közvetlenül, a közel-keleti közvetítők kihagyásával szerezzen fűszereket.',
        'Megalapozta a portugál világbirodalom indiai és kelet-afrikai támaszpontjait.',
    ],
  },
  magellan: {
    name: 'Fernão de Magalhães / Magellán-expedíció (1519–1522)',
    description: 'Portugál származású, spanyol szolgálatban álló hajós, akinek expedíciója elsőként került meg a Földet, bizonyítva annak gömb alakját.',
    significance: [
        'Bizonyította, hogy a Föld körbehajózható, és az óceánok egységes, összefüggő vízfelületet alkotnak.',
        'Feltárta a később Magellán-szorosnak nevezett átjárót Dél-Amerika déli csúcsánál.',
        'Új ismereteket adott a Csendes-óceán méreteiről és a Fülöp-szigetek térségéről.',
    ],
  },
  vespucci: {
    name: 'Amerigo Vespucci útjai (1499–1502)',
    description: 'Olasz származású, spanyol és portugál szolgálatban álló hajós, aki több dél-amerikai part menti expedíció során felismerte, hogy az újonnan felfedezett földrészek nem Ázsiához tartoznak, hanem egy teljesen új kontinensről van szó.',
    significance: [
      'Elsők között fogalmazta meg, hogy a Kolumbusz által elért területek egy új, addig ismeretlen földrészhez tartoznak.',
      'Dél-Amerika keleti partvidékének részletesebb feltérképezéséhez járult hozzá.',
      'Nevéről kapta a nevét az „Amerika” elnevezés, amelyet később a kontinensekre általánosan használtak.'
    ]
  },
  cortez: {
    name: 'Hernán Cortés (1519–1521)',
    description: 'Spanyol konkvisztádor, aki katonai és diplomáciai eszközökkel meghódította az Azték Birodalmat Mexikó területén.',
    significance: [
      'Az Azték Birodalom megdöntésével Mexikó spanyol gyarmattá vált.',
      'Hatalmas nemesfémkészletek kerültek a spanyol koronához, erősítve annak európai hatalmát.',
      'A hódítás mély társadalmi és kulturális átalakulást indított el Közép-Amerikában.',
    ],
  },
  pizarro: {
    name: 'Francisco Pizarro (1530–1534)',
    description: 'Spanyol konkvisztádor, aki hadjárataival az Inka Birodalmat hódította meg a mai Peru és környező területek vidékén.',
    significance: [
      'Az Inka Birodalom bukásával Dél-Amerika nyugati része spanyol ellenőrzés alá került.',
      'A perui ezüst- és aranybányák a spanyol világbirodalom gazdasági alapját erősítették.',
      'A térség társadalmi, etnikai és vallási viszonyai gyökeresen átalakultak.',
    ],
  },
};

const ExplorerContent: React.FC<{ info: { name: string; description: string; significance: string[] } }> = ({ info }) => (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold text-gray-800">{info.name}</h3>
        <p className="text-sm text-gray-700 mt-2">{info.description}</p>
      </div>
      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Jelentősége</h4>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
          {info.significance.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      </div>
    </div>
);

const ConsequencesContent: React.FC = () => (
    <div className="space-y-4 text-sm">
        <h3 className="text-xl font-bold text-gray-800">A földrajzi felfedezések következményei</h3>
        <div>
            <h4 className="font-semibold text-gray-700 mb-2">Gazdasági következmények</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Az Atlanti-óceán lett a világkereskedelem központja.</li>
                <li>Új növények és áruk érkeznek (burgonya, kukorica, kakaó, dohány, cukornád).</li>
                <li>Az amerikai ezüst beáramlása árforradalmat okoz Európában.</li>
                <li>Kialakul a globális kereskedelem első formája.</li>
            </ul>
        </div>
        <div>
            <h4 className="font-semibold text-gray-700 mb-2">Politikai és hatalmi következmények</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Spanyolország és Portugália tengeri birodalmakat épít.</li>
                <li>Anglia, Franciaország, Hollandia is bekapcsolódik a gyarmatosításba.</li>
                <li>A gyarmati rivalizálás később háborúkhoz vezet Európában.</li>
            </ul>
        </div>
        <div>
            <h4 className="font-semibold text-gray-700 mb-2">Társadalmi és demográfiai következmények</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Amerika őslakosságának jelentős része elpusztul betegségek és hódítások miatt.</li>
                <li>Megindul a transzatlanti rabszolga-kereskedelem.</li>
                <li>Latin-Amerikában kevert népességű társadalmak jelennek meg (mesztic, kreol, mulatt).</li>
            </ul>
        </div>
        <div>
            <h4 className="font-semibold text-gray-700 mb-2">Kulturális és vallási következmények</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Európai nyelvek és kultúrák elterjednek Amerikában.</li>
                <li>A keresztény missziók térítenek az Újvilágban.</li>
                <li>Ősi amerikai kultúrák részben eltűnnek, részben átalakulnak.</li>
            </ul>
        </div>
        <div>
            <h4 className="font-semibold text-gray-700 mb-2">Tudományos és földrajzi következmények</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Pontosabb világtérképek születnek.</li>
                <li>A Föld gömb alakját a Magellán-expedíció bizonyítja.</li>
                <li>Fejlődik a navigáció, csillagászat és térképészet.</li>
            </ul>
        </div>
    </div>
);


const EducationalPanel: React.FC<EducationalPanelProps> = ({ selectedExplorerId, onClose }) => {
  const [activeTab, setActiveTab] = useState<'explorers' | 'consequences'>('explorers');

  const selectedInfo = selectedExplorerId ? explorerInfo[selectedExplorerId] : null;

  if (!selectedExplorerId) {
    return null;
  }

  return (
    <div className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-5 rounded-lg shadow-xl z-20 w-full max-w-sm md:max-w-md max-h-[calc(100vh-4rem)] flex flex-col">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        aria-label="Bezárás"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex-shrink-0 border-b border-gray-200">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('explorers')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg focus:outline-none transition-colors duration-200 ${
              activeTab === 'explorers'
                ? 'bg-white border-gray-200 border-l border-t border-r -mb-px text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Felfedezők
          </button>
          <button
            onClick={() => setActiveTab('consequences')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg focus:outline-none transition-colors duration-200 ${
              activeTab === 'consequences'
                ? 'bg-white border-gray-200 border-l border-t border-r -mb-px text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Következmények
          </button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto pt-4 pr-2">
        {activeTab === 'explorers' && (
          selectedInfo ? <ExplorerContent info={selectedInfo} /> : <p className="text-gray-600">Válassz ki egy felfedező útvonalát a térképen!</p>
        )}
        {activeTab === 'consequences' && <ConsequencesContent />}
      </div>
    </div>
  );
};

export default EducationalPanel;
