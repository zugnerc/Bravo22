
import React from 'react';
import type { PlannerEvent } from '../types';
import { EditableField } from './EditableField';
import { TrashIcon, PlusCircleIcon } from './Icons';

interface ActivityPlannerTabProps {
  events: PlannerEvent[];
  setEvents: React.Dispatch<React.SetStateAction<PlannerEvent[]>>;
}

export const ActivityPlannerTab: React.FC<ActivityPlannerTabProps> = ({ events, setEvents }) => {

  const addEvent = () => {
    const newEvent: PlannerEvent = {
        id: `event-${Date.now()}`,
        title: 'Nuevo Evento',
        date: new Date().toISOString().slice(0, 16),
        location: 'Por definir',
        status: 'Planeado',
        notes: ''
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const updateEvent = (id: string, updatedFields: Partial<PlannerEvent>) => {
    setEvents(prev => prev.map(event => event.id === id ? { ...event, ...updatedFields } : event));
  };

  const statusColors = {
    'Planeado': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Confirmado': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Completado': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    'Cancelado': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Planificador de Actividades</h2>
        <button onClick={addEvent} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <PlusCircleIcon className="w-5 h-5" />
            <span>Nuevo Evento</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col gap-3 relative group">
            <div className="flex justify-between items-start">
              <EditableField initialValue={event.title} onSave={val => updateEvent(event.id, { title: val })} className="font-bold text-lg w-full" />
              <button onClick={() => deleteEvent(event.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3">
                  <TrashIcon className="w-5 h-5"/>
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500">Fecha y Hora</label>
              <input 
                type="datetime-local" 
                value={event.date} 
                onChange={(e) => updateEvent(event.id, { date: e.target.value })}
                className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500">Ubicación / Link</label>
              <EditableField initialValue={event.location} onSave={val => updateEvent(event.id, { location: val })} className="text-sm" />
            </div>

             <div>
              <label className="text-xs font-semibold text-gray-500">Estado</label>
               <select
                value={event.status}
                onChange={(e) => updateEvent(event.id, { status: e.target.value as PlannerEvent['status'] })}
                className={`w-full p-1 border-0 rounded text-sm font-medium ${statusColors[event.status]}`}
              >
                <option value="Planeado">Planeado</option>
                <option value="Confirmado">Confirmado</option>
                <option value="Completado">Completado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs font-semibold text-gray-500">Notas</label>
              <EditableField as="textarea" initialValue={event.notes} onSave={val => updateEvent(event.id, { notes: val })} className="text-sm w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
