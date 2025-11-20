
import React, { useState, useMemo } from 'react';
import type { Concept, ConceptCategory } from '../types';

interface ConceptJournalProps {
  isOpen: boolean;
  onClose: () => void;
  concepts: Concept[];
  onDelete: (id: string) => void;
}

const ConceptJournal: React.FC<ConceptJournalProps> = ({ isOpen, onClose, concepts, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ConceptCategory | 'Összes'>('Összes');

  const categories: (ConceptCategory | 'Összes')[] = ['Összes', 'Felfedező', 'Útvonal', 'Gyarmat', 'Esemény', 'Város', 'Egyéb'];

  const filteredConcepts = useMemo(() => {
    return concepts.filter(concept => {
      const matchesSearch = concept.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            concept.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Összes' || concept.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => b.createdAt - a.createdAt);
  }, [concepts, searchTerm, selectedCategory]);

  const handleExport = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredConcepts, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "fogalom_naplo.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } else {
      const headers = ["Név", "Kategória", "Év", "Definíció"];
      const rows = filteredConcepts.map(c => [
        `"${c.name.replace(/"/g, '""')}"`,
        c.category,
        c.year || "",
        `"${c.definition.replace(/"/g, '""')}"`
      ]);
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const encodeUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodeUri);
      link.setAttribute("download", "fogalom_naplo.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  const getCategoryColor = (category: ConceptCategory) => {
    switch (category) {
      case 'Felfedező': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Útvonal': return 'bg-green-100 text-green-800 border-green-200';
      case 'Gyarmat': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Esemény': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Város': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 pointer-events-auto transition-opacity" onClick={onClose} />
      
      {/* Sidebar */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl transform transition-transform duration-300 pointer-events-auto flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Fogalom Napló</h2>
            <p className="text-sm text-gray-500">{filteredConcepts.length} mentett fogalom</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b space-y-3 bg-white">
          <input 
            type="text" 
            placeholder="Keresés a fogalmak között..." 
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {filteredConcepts.length > 0 ? (
            filteredConcepts.map(concept => (
              <div key={concept.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded border ${getCategoryColor(concept.category)}`}>
                    {concept.category}
                  </span>
                  {concept.year && <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">{concept.year}</span>}
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-1">{concept.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{concept.definition}</p>
                
                <button 
                  onClick={() => onDelete(concept.id)}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity p-1"
                  title="Törlés"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>Nincs találat.</p>
              <p className="text-sm mt-1">Ments el fogalmakat a térképről vagy az idővonalról!</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-white flex justify-between gap-4">
            <button 
                onClick={() => handleExport('json')}
                className="flex-1 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                JSON Mentés
            </button>
            <button 
                onClick={() => handleExport('csv')}
                className="flex-1 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                CSV Mentés
            </button>
        </div>

      </div>
    </div>
  );
};

export default ConceptJournal;
