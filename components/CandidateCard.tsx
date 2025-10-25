import React, { useState } from 'react';
import type { Candidate } from '../types';
import { EditableField } from './EditableField';
import { FacebookIcon, TikTokIcon, CopyIcon, TrashIcon, EditIcon } from './Icons';

interface CandidateCardProps {
  candidate: Candidate;
  onUpdate: (candidateId: string, updatedCandidate: Partial<Candidate>) => void;
  onDelete?: (candidateId: string) => void;
  positionTitle?: string;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onUpdate, onDelete, positionTitle }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyDNI = () => {
    navigator.clipboard.writeText(candidate.dni);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditPhoto = () => {
    const newUrl = prompt("Ingrese la nueva URL de la foto:", candidate.photoUrl);
    if (newUrl) {
        onUpdate(candidate.id, { photoUrl: newUrl });
    }
  };

  const rankColor = candidate.ranking === 1 ? 'bg-green-500' : 'bg-gray-500';

  const positionColors = {
      gobernador: 'text-blue-600 dark:text-blue-400',
      alcalde_provincial: 'text-green-600 dark:text-green-400',
      alcalde_distrital: 'text-yellow-600 dark:text-yellow-400',
  }

  return (
    <div className="p-3 border-t border-gray-200 dark:border-gray-700 relative group">
      <div className="flex items-start gap-3">
        {typeof candidate.ranking === 'number' && (
          <div className={`absolute top-2 right-2 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${rankColor}`}>
            <EditableField 
              initialValue={candidate.ranking}
              onSave={val => onUpdate(candidate.id, { ranking: parseInt(val, 10) || 0 })}
              as="number"
              className="w-full h-full text-center bg-transparent"
            />
          </div>
        )}
        <div className="relative w-16 h-16 flex-shrink-0">
            <img src={candidate.photoUrl} alt={candidate.name} className="w-16 h-16 rounded-full object-cover" />
             <button onClick={handleEditPhoto} className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity no-print">
                <EditIcon className="w-6 h-6 text-white"/>
            </button>
        </div>
        <div className="flex-grow">
          {positionTitle && <p className={`text-xs font-bold uppercase ${positionColors[candidate.position]}`}>{positionTitle}</p>}
          <EditableField initialValue={candidate.name} onSave={val => onUpdate(candidate.id, { name: val })} className="font-semibold" />
          <EditableField initialValue={candidate.nickname} onSave={val => onUpdate(candidate.id, { nickname: val })} className="text-xs text-gray-500 italic" />
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-mono">DNI:</span>
            <EditableField initialValue={candidate.dni} onSave={val => onUpdate(candidate.id, { dni: val })} className="text-xs font-mono" />
            <button onClick={handleCopyDNI} className="text-gray-400 hover:text-blue-500 relative">
              <CopyIcon className="w-3 h-3" />
              {copied && <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded">Copiado!</span>}
            </button>
          </div>
          <div className="text-xs mt-1">
            <span className={`px-2 py-0.5 rounded-full ${candidate.isAffiliated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {candidate.isAffiliated ? 'Afiliado' : 'No Afiliado'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 mt-2">
        <a href={candidate.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600">
          <FacebookIcon className="w-5 h-5" />
        </a>
        <a href={candidate.tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black dark:hover:text-white">
          <TikTokIcon className="w-5 h-5" />
        </a>
      </div>
       {onDelete && (
        <button onClick={() => onDelete(candidate.id)} className="absolute top-2 left-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity no-print">
            <TrashIcon className="w-4 h-4"/>
        </button>
       )}
    </div>
  );
};