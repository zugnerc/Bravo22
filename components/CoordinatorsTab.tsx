import React from 'react';
import type { Coordinator } from '../types';
import { EditableField } from './EditableField';
import { WhatsAppIcon, TrashIcon, PlusCircleIcon } from './Icons';
import { Collapsible } from './Collapsible';

interface CoordinatorsTabProps {
  coordinators: Coordinator[];
  setCoordinators: React.Dispatch<React.SetStateAction<Coordinator[]>>;
}

export const CoordinatorsTab: React.FC<CoordinatorsTabProps> = ({ coordinators, setCoordinators }) => {
    
    const addCoordinator = () => {
        const newCoord: Coordinator = {
            id: `coord-${Date.now()}`,
            name: 'Nuevo Coordinador',
            nickname: 'Apelativo',
            phone: '51',
            address: 'Dirección',
            sector: 'Sector',
            province: 'Santa',
            district: 'Chimbote'
        };
        setCoordinators(prev => [newCoord, ...prev]);
    };
    
    const deleteCoordinator = (id: string) => {
        setCoordinators(prev => prev.filter(c => c.id !== id));
    };

    const updateCoordinator = (id: string, updatedFields: Partial<Coordinator>) => {
        setCoordinators(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
    };
    
    // FIX: Group coordinators by province using a more robustly typed reduce function.
    const coordinatorsByProvince = coordinators.reduce<
      Record<string, Coordinator[]>
    >((acc, curr) => {
      const province = curr.province;
      if (!acc[province]) {
        acc[province] = [];
      }
      acc[province].push(curr);
      return acc;
    }, {});

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Base de Datos de Coordinadores</h2>
         <button onClick={addCoordinator} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <PlusCircleIcon className="w-5 h-5" />
            <span>Nuevo Coordinador</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {Object.entries(coordinatorsByProvince).map(([province, coords]) => (
            <Collapsible key={province} title={<span className="font-bold text-lg">{province}</span>} defaultOpen>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-2">
                    {coords.map(coord => (
                        <div key={coord.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2 relative group">
                            <button onClick={() => deleteCoordinator(coord.id)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                            <EditableField initialValue={coord.name} onSave={val => updateCoordinator(coord.id, { name: val })} className="font-semibold text-base" />
                            <EditableField initialValue={coord.nickname} onSave={val => updateCoordinator(coord.id, { nickname: val })} className="text-sm italic text-gray-500" />
                            
                            <div className="text-sm">
                                <span className="font-semibold">Distrito: </span>
                                <EditableField initialValue={coord.district} onSave={val => updateCoordinator(coord.id, { district: val })} />
                            </div>
                            <div className="text-sm">
                                <span className="font-semibold">Vive en: </span>
                                <EditableField initialValue={coord.address} onSave={val => updateCoordinator(coord.id, { address: val })} />
                            </div>
                            <div className="text-sm">
                                <span className="font-semibold">Sector: </span>
                                <EditableField initialValue={coord.sector} onSave={val => updateCoordinator(coord.id, { sector: val })} />
                            </div>
                            
                            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2">
                                     <span className="font-semibold text-sm">Celular:</span>
                                     <EditableField initialValue={coord.phone} onSave={val => updateCoordinator(coord.id, { phone: val })} className="text-sm" />
                                </div>
                                <a href={`https://wa.me/${coord.phone}`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-600">
                                    <WhatsAppIcon className="w-6 h-6"/>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </Collapsible>
        ))}
      </div>
    </div>
  );
};