import React from 'react';
import type { Party, Candidate, Province, SituationalStatusData, District } from '../types';
import { Collapsible } from './Collapsible';
import { CandidateCard } from './CandidateCard';
import { EditableField } from './EditableField';
import { TrashIcon, EditIcon } from './Icons';

interface PartyColumnProps {
  party: Party;
  data: SituationalStatusData;
  setData: React.Dispatch<React.SetStateAction<SituationalStatusData>>;
  onDeleteParty: (partyId: string) => void;
}

export const PartyColumn: React.FC<PartyColumnProps> = ({ party, data, setData, onDeleteParty }) => {
  const governor = data.candidates.find(c => c.partyId === party.id && c.position === 'gobernador');
  
  const provincialMayors = data.candidates
    .filter(c => c.partyId === party.id && c.position === 'alcalde_provincial')
    .sort((a, b) => (a.ranking ?? Infinity) - (b.ranking ?? Infinity));

  const districtMayors = data.candidates
    .filter(c => c.partyId === party.id && c.position === 'alcalde_distrital')
    .sort((a, b) => (a.ranking ?? Infinity) - (b.ranking ?? Infinity));


  const handleUpdateParty = (field: keyof Party, value: string) => {
    setData(prev => ({
      ...prev,
      parties: prev.parties.map(p => p.id === party.id ? { ...p, [field]: value } : p)
    }));
  };

  const handleEditPartySymbol = () => {
    const newUrl = prompt("Ingrese la nueva URL del símbolo:", party.symbolUrl);
    if (newUrl) {
      handleUpdateParty('symbolUrl', newUrl);
    }
  };
  
  const handleUpdateCandidate = (candidateId: string, updatedCandidate: Partial<Candidate>) => {
    setData(prev => ({
        ...prev,
        candidates: prev.candidates.map(c => c.id === candidateId ? { ...c, ...updatedCandidate } : c)
    }));
  };
  
  const handleDeleteCandidate = (candidateId: string) => {
    if (window.confirm('¿Seguro que quieres eliminar este candidato?')) {
        setData(prev => ({
            ...prev,
            candidates: prev.candidates.filter(c => c.id !== candidateId)
        }));
    }
  };

  const handleAddCandidate = (position: Candidate['position'], provinceId?: string, districtId?: string) => {
      const newCandidate: Candidate = {
          id: `c${Date.now()}`,
          photoUrl: 'https://via.placeholder.com/100',
          name: `Nuevo Candidato`,
          dni: '00000000',
          nickname: 'Apelativo',
          partyId: party.id,
          isAffiliated: false,
          facebookUrl: '#',
          tiktokUrl: '#',
          position: position,
          provinceId,
          districtId,
          ranking: 99,
      };
      if (position === 'gobernador') {
          newCandidate.ranking = data.candidates.filter(c => c.position === 'gobernador').length + 1;
      }
      setData(prev => ({ ...prev, candidates: [...prev.candidates, newCandidate] }));
  };

  const handleAddDistrict = (provinceId: string) => {
    const name = prompt("Nombre del nuevo distrito:");
    if (name) {
        const newDistrict: District = { id: `dist${Date.now()}`, name, voters: 0 };
        setData(prev => ({
            ...prev,
            provinces: prev.provinces.map(p => 
                p.id === provinceId 
                ? { ...p, districts: [...p.districts, newDistrict] }
                : p
            )
        }));
    }
  };

  const handleUpdateProvinceVoters = (provinceId: string, voters: number) => {
    setData(prev => ({
        ...prev,
        provinces: prev.provinces.map(p => p.id === provinceId ? { ...p, voters } : p)
    }));
  };

  const sortedProvinces = [...data.provinces].sort((a, b) => b.voters - a.voters);

  const partyHeader = (
    <div className="flex items-center gap-3 w-full">
      <div className="relative w-10 h-10 flex-shrink-0 group">
          <img src={party.symbolUrl} alt={party.name} className="w-10 h-10 rounded-full object-cover" />
          <button onClick={handleEditPartySymbol} className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity no-print">
              <EditIcon className="w-5 h-5 text-white"/>
          </button>
      </div>
      <div className="flex-grow">
        <EditableField initialValue={party.name} onSave={val => handleUpdateParty('name', val)} className="font-bold text-base" />
        <EditableField initialValue={party.type} onSave={val => handleUpdateParty('type', val as 'Nuevo' | 'Tradicional')} className="text-xs text-gray-500" />
      </div>
      <button onClick={() => onDeleteParty(party.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 flex-shrink-0">
          <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <Collapsible title={partyHeader} defaultOpen={true} headerClassName="hover:bg-gray-100 dark:hover:bg-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 px-3 pb-2 border-b dark:border-gray-700">
          Candidatos: G: {governor ? 1 : 0}, P: {provincialMayors.length}, D: {districtMayors.length}
           {!governor && (
            <button onClick={() => handleAddCandidate('gobernador')} className="text-blue-500 text-xs ml-2 font-semibold">
              + Gobernador
            </button>
          )}
        </div>
        
        {governor && (
          <Collapsible 
            title={<span className="font-semibold text-blue-700 dark:text-blue-400">Gobernador</span>}
            headerClassName="bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50"
            defaultOpen={true}
          >
            <CandidateCard candidate={governor} onUpdate={handleUpdateCandidate} onDelete={handleDeleteCandidate} />
          </Collapsible>
        )}

        {sortedProvinces.map(province => {
          const provincialMayor = provincialMayors.find(c => c.provinceId === province.id);
          const provinceDistrictMayors = districtMayors.filter(c => c.provinceId === province.id);
          
          if (!provincialMayor && provinceDistrictMayors.length === 0 && data.provinces.length > 0) {
            // Still show province to allow adding a mayor
          }

          const provinceTitle = (
            <div className="flex justify-between items-center w-full">
                <span className="font-semibold text-green-700 dark:text-green-400">{province.name}</span>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <EditableField 
                        initialValue={province.voters} 
                        onSave={val => handleUpdateProvinceVoters(province.id, parseInt(val, 10) || 0)} 
                        as="number"
                    />
                    <span>electores</span>
                </div>
            </div>
          );

          return (
            <Collapsible 
                key={province.id}
                title={provinceTitle}
                headerClassName="bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50"
                defaultOpen={true}
            >
              {provincialMayor 
                ? <CandidateCard candidate={provincialMayor} onUpdate={handleUpdateCandidate} onDelete={handleDeleteCandidate} positionTitle="Alcalde Provincial" />
                : <button onClick={() => handleAddCandidate('alcalde_provincial', province.id)} className="text-green-500 text-sm p-3 font-semibold w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700/50">+ Alcalde Provincial</button>
              }

              <div className="pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                {province.districts.sort((a,b) => b.voters - a.voters).map(district => {
                  const districtMayor = provinceDistrictMayors.find(c => c.districtId === district.id);

                  const districtTitle = (
                      <div className="flex justify-between items-center w-full">
                          <span className="font-semibold text-yellow-700 dark:text-yellow-400">{district.name}</span>
                           <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                             {/* Add editable district voters if needed */}
                           </div>
                      </div>
                  );

                  return (
                      <Collapsible
                          key={district.id}
                          title={districtTitle}
                          headerClassName="bg-yellow-50 dark:bg-yellow-900/30 hover:bg-yellow-100 dark:hover:bg-yellow-900/50"
                      >
                        {districtMayor
                          ? <CandidateCard candidate={districtMayor} onUpdate={handleUpdateCandidate} onDelete={handleDeleteCandidate} positionTitle="Alcalde Distrital" />
                          : <button onClick={() => handleAddCandidate('alcalde_distrital', province.id, district.id)} className="text-yellow-500 text-sm p-3 font-semibold w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700/50">+ Alcalde Distrital</button>
                        }
                      </Collapsible>
                  )
                })}
                <button onClick={() => handleAddDistrict(province.id)} className="text-gray-500 text-xs p-2 font-semibold w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700/50">+ Nuevo Distrito</button>
              </div>
            </Collapsible>
          );
        })}
      </Collapsible>
    </div>
  );
};