import React from 'react';
import type { SituationalStatusData, Party, Province, OtherPartyActivity, PlannerEvent } from '../types';
import { PartyColumn } from './PartyColumn';
import { EditableField } from './EditableField';
import { PlusCircleIcon, TrashIcon } from './Icons';

interface SituationalStatusTabProps {
  data: SituationalStatusData;
  setData: React.Dispatch<React.SetStateAction<SituationalStatusData>>;
  events: PlannerEvent[];
  setEvents: React.Dispatch<React.SetStateAction<PlannerEvent[]>>;
}

export const SituationalStatusTab: React.FC<SituationalStatusTabProps> = ({ data, setData, events, setEvents }) => {
  const { ancashVoters, parties, candidates, provinces, otherActivities } = data;

  const handleUpdate = (field: keyof SituationalStatusData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleUpdateAgendaEvent = (id: string, updatedFields: Partial<PlannerEvent>) => {
    setEvents(prev => prev.map(event => event.id === id ? { ...event, ...updatedFields } : event));
  };
  
  const formatDateForAgenda = (dateString: string) => {
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date).toUpperCase();
    } catch {
        return dateString;
    }
  };

  const handleUpdateOtherActivity = (id: string, field: keyof OtherPartyActivity, value: string) => {
      setData(prev => ({
          ...prev,
          otherActivities: prev.otherActivities.map(item => item.id === id ? { ...item, [field]: value } : item)
      }));
  };

  const handleDeleteOtherActivity = (id: string) => {
      setData(prev => ({
          ...prev,
          otherActivities: prev.otherActivities.filter(item => item.id !== id)
      }));
  }
  
  const addParty = () => {
    const newParty: Party = { id: `p${Date.now()}`, name: 'Nuevo Partido', symbolUrl: 'https://via.placeholder.com/50', type: 'Nuevo' };
    setData(prev => ({ ...prev, parties: [...prev.parties, newParty] }));
  };

  const deleteParty = (partyId: string) => {
    if (window.confirm('¿Seguro que quieres eliminar este partido y todos sus candidatos asociados?')) {
        setData(prev => ({
            ...prev,
            parties: prev.parties.filter(p => p.id !== partyId),
            candidates: prev.candidates.filter(c => c.partyId !== partyId)
        }));
    }
  };
  
  const addProvince = () => {
    const name = prompt("Nombre de la nueva provincia:");
    if (name) {
        const newProvince: Province = { id: `prov${Date.now()}`, name, voters: 0, districts: [] };
        setData(prev => ({ ...prev, provinces: [...prev.provinces, newProvince] }));
    }
  };


  const sortedPartiesByGovernorRank = [...parties].sort((a, b) => {
    const rankA = candidates.find(c => c.partyId === a.id && c.position === 'gobernador')?.ranking || Infinity;
    const rankB = candidates.find(c => c.partyId === b.id && c.position === 'gobernador')?.ranking || Infinity;
    return rankA - rankB;
  });
  
  const upcomingEvents = [...events]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-grow">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-bold">BRAVO22-ANCASH</h2>
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
              <span>(Electores:</span>
              <EditableField
                initialValue={ancashVoters}
                onSave={value => handleUpdate('ancashVoters', parseInt(value, 10) || 0)}
                as="number"
                className="w-24 text-sm"
              />
              <span>)</span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Comparador de Candidaturas - Elecciones Regionales y Municipales 2026</p>
        </div>
        
        <div className="flex items-center gap-4 mb-6 no-print">
            <button onClick={addParty} className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm">
                <PlusCircleIcon className="w-5 h-5" />
                <span>Nuevo Partido</span>
            </button>
            <button onClick={addProvince} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                <PlusCircleIcon className="w-5 h-5" />
                <span>Nueva Provincia</span>
            </button>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedPartiesByGovernorRank.map(party => (
            <PartyColumn 
              key={party.id} 
              party={party} 
              data={data}
              setData={setData}
              onDeleteParty={deleteParty}
            />
          ))}
        </div>
      </div>

      <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 space-y-6 no-print">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2 border-gray-300 dark:border-gray-600">Mi Agenda (del Planificador)</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {upcomingEvents.map(item => (
              <div key={item.id} className="text-sm">
                <EditableField initialValue={item.title} onSave={val => handleUpdateAgendaEvent(item.id, { title: val })} as="textarea" />
                <div className="flex justify-between items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                   <span className="font-semibold">{formatDateForAgenda(item.date)}</span>
                   <EditableField initialValue={item.location} onSave={val => handleUpdateAgendaEvent(item.id, { location: val })} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2 border-gray-300 dark:border-gray-600">Actividades de Otros Partidos</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {otherActivities.map(activity => {
              const party = parties.find(p => p.id === activity.partyId);
              return (
                <div key={activity.id} className="flex items-start gap-3 text-sm group relative">
                  {party && <img src={party.symbolUrl} alt={party.name} className="w-8 h-8 rounded-full mt-1" />}
                  <div className="flex-grow">
                    <EditableField initialValue={activity.description} onSave={val => handleUpdateOtherActivity(activity.id, 'description', val)} as="textarea" />
                    <EditableField initialValue={activity.link} onSave={val => handleUpdateOtherActivity(activity.id, 'link', val)} className="text-xs text-blue-500 mt-1" />
                  </div>
                   <button onClick={() => handleDeleteOtherActivity(activity.id)} className="absolute top-0 right-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
};