import React from 'react';
import type { RegionalBodyData, Official, Counselor, MayorCandidate, RegionalProvince, RegionalDistrict } from '../types';
import { Collapsible } from './Collapsible';
import { EditableField } from './EditableField';
import { FacebookIcon, TikTokIcon, CopyIcon, TrashIcon, PlusCircleIcon, WhatsAppIcon } from './Icons';

interface RegionalBodyTabProps {
  data: RegionalBodyData;
  setData: React.Dispatch<React.SetStateAction<RegionalBodyData>>;
}

const OfficialCard: React.FC<{ official: Official }> = ({ official }) => {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(official.dni);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
      <EditableField initialValue={official.position} onSave={() => {}} className="text-sm font-bold" />
      <EditableField initialValue={official.name} onSave={() => {}} className="text-lg" />
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs font-mono">DNI:</span>
        <EditableField initialValue={official.dni} onSave={() => {}} className="text-sm font-mono" />
        <button onClick={handleCopy} className="text-gray-400 hover:text-blue-500 relative">
          <CopyIcon className="w-4 h-4" />
          {copied && <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded">Copiado</span>}
        </button>
      </div>
    </div>
  );
};

const PersonCard: React.FC<{ person: Counselor | MayorCandidate, type: 'counselor' | 'mayor' }> = ({ person, type }) => {
    return (
        <div className="p-3 border rounded-lg bg-white dark:bg-gray-700/50 mb-2">
            <EditableField initialValue={person.name} onSave={() => {}} className="font-semibold" />
            {'nickname' in person && <EditableField initialValue={person.nickname} onSave={() => {}} className="text-sm italic text-gray-500" />}
             <div className="flex items-center gap-2 mt-1">
                 <span className="text-xs font-mono">DNI:</span>
                 <EditableField initialValue={person.dni} onSave={() => {}} className="text-sm font-mono" />
                 <CopyIcon className="w-4 h-4 cursor-pointer" onClick={() => navigator.clipboard.writeText(person.dni)} />
             </div>
             <div className="flex items-center gap-4 mt-2">
                <a href={person.facebookUrl}><FacebookIcon className="w-5 h-5 text-gray-500 hover:text-blue-600" /></a>
                <a href={person.tiktokUrl}><TikTokIcon className="w-5 h-5 text-gray-500 hover:text-black dark:hover:text-white" /></a>
                <div className="flex-grow flex items-center gap-2">
                    <EditableField initialValue={person.phone} onSave={() => {}} className="text-sm" />
                    <a href={`https://wa.me/${person.phone}`} target="_blank" rel="noopener noreferrer" title="Abrir en WhatsApp">
                        <WhatsAppIcon className="w-5 h-5 text-green-500 hover:text-green-600"/>
                    </a>
                </div>
             </div>
             {type === 'counselor' && 'role' in person &&
                <div className="flex flex-wrap gap-2 text-xs mt-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{person.role}</span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">{person.quotaGender}</span>
                    {person.isAffiliated && <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">Afiliado</span>}
                    {person.quotaCommunity && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Comunidades</span>}
                </div>
             }
        </div>
    )
}

export const RegionalBodyTab: React.FC<RegionalBodyTabProps> = ({ data, setData }) => {

  const addRegionalCounselor = () => {
    const newCounselor: Counselor = { id: `cn${Date.now()}`, name: 'Nuevo Consejero', dni: '00000000', facebookUrl: '#', tiktokUrl: '#', quotaGender: '', quotaCommunity: false, isAffiliated: false, role: 'Titular', phone: '51' };
    setData(prev => ({...prev, regionalCounselors: [...prev.regionalCounselors, newCounselor] }));
  };

  const addProvince = () => {
    const name = prompt("Nombre de la nueva provincia:");
    if (!name) return;
    const defaultCouncilors: Counselor[] = [{ id: `cn${Date.now()}`, name: 'Nuevo Regidor', dni: '00000000', facebookUrl: '#', tiktokUrl: '#', quotaGender: '', quotaCommunity: false, isAffiliated: false, role: 'Titular', phone: '51' }];
    const newProvince: RegionalProvince = {
        id: `rp${Date.now()}`, name, voters: 0, 
        mayor: { id: `rm${Date.now()}`, name: `Alcalde de ${name}`, nickname: '', dni: '00000000', facebookUrl: '#', tiktokUrl: '#', isAffiliated: false, gender: 'Masculino', phone: '51', councilors: defaultCouncilors },
        districts: []
    };
    setData(prev => ({ ...prev, provinces: [...prev.provinces, newProvince] }));
  };

  const addProvincialCouncilor = (provinceId: string) => {
    setData(prev => ({
        ...prev,
        provinces: prev.provinces.map(prov => {
            if (prov.id === provinceId) {
                const newCouncilor: Counselor = { id: `cn${Date.now()}`, name: 'Nuevo Regidor Provincial', dni: '00000000', facebookUrl: '#', tiktokUrl: '#', quotaGender: '', quotaCommunity: false, isAffiliated: false, role: 'Titular', phone: '51' };
                return { ...prov, mayor: { ...prov.mayor, councilors: [...prov.mayor.councilors, newCouncilor] } };
            }
            return prov;
        })
    }));
  };

  const addDistrict = (provinceId: string) => {
      const name = prompt("Nombre del nuevo distrito:");
      if(!name) return;
      const defaultCouncilors: Counselor[] = [{ id: `cn${Date.now()}`, name: 'Nuevo Regidor Distrital', dni: '00000000', facebookUrl: '#', tiktokUrl: '#', quotaGender: '', quotaCommunity: false, isAffiliated: false, role: 'Titular', phone: '51' }];
      const newDistrict: RegionalDistrict = {
          id: `rd${Date.now()}`, name, voters: 0,
          mayor: { id: `rdm${Date.now()}`, name: `Alcalde de ${name}`, nickname: '', dni: '00000000', facebookUrl: '#', tiktokUrl: '#', isAffiliated: false, gender: 'Masculino', phone: '51', councilors: defaultCouncilors }
      };
      setData(prev => ({
          ...prev,
          provinces: prev.provinces.map(p => p.id === provinceId ? { ...p, districts: [...p.districts, newDistrict] } : p)
      }));
  };

  const addDistrictCouncilor = (provinceId: string, districtId: string) => {
    setData(prev => ({
        ...prev,
        provinces: prev.provinces.map(prov => {
            if (prov.id === provinceId) {
                return {
                    ...prov,
                    districts: prov.districts.map(dist => {
                        if (dist.id === districtId) {
                             const newCouncilor: Counselor = { id: `cn${Date.now()}`, name: 'Nuevo Regidor Distrital', dni: '00000000', facebookUrl: '#', tiktokUrl: '#', quotaGender: '', quotaCommunity: false, isAffiliated: false, role: 'Titular', phone: '51' };
                            return { ...dist, mayor: { ...dist.mayor, councilors: [...dist.mayor.councilors, newCouncilor] } };
                        }
                        return dist;
                    })
                };
            }
            return prov;
        })
    }));
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Plancha Regional</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
            {data.governorate.map(official => <OfficialCard key={official.id} official={official} />)}
        </div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Consejeros Regionales</h3>
          <button onClick={addRegionalCounselor} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-semibold"><PlusCircleIcon className="w-4 h-4"/>Añadir</button>
        </div>
        <div className="space-y-2">
            {data.regionalCounselors.map(counselor => <PersonCard key={counselor.id} person={counselor} type="counselor" />)}
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Listas Provinciales y Distritales</h2>
            <button onClick={addProvince} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"><PlusCircleIcon className="w-5 h-5" />Nueva Provincia</button>
        </div>
        {data.provinces.map(province => (
            <Collapsible key={province.id} title={<span className="font-bold text-lg">{province.name}</span>} headerClassName="bg-gray-100 dark:bg-gray-700 rounded-t-lg" defaultOpen>
                <div className="p-4">
                    <h4 className="font-semibold text-md mb-2 text-green-600 dark:text-green-400">Alcalde Provincial</h4>
                    <PersonCard person={province.mayor} type="mayor" />
                    <Collapsible title="Regidores Provinciales" headerClassName="text-sm">
                        {province.mayor.councilors.map(c => <PersonCard key={c.id} person={c} type="counselor" />)}
                        <button onClick={() => addProvincialCouncilor(province.id)} className="w-full text-left p-2 text-sm text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700/50 flex items-center gap-1"><PlusCircleIcon className="w-4 h-4"/>Añadir Regidor</button>
                    </Collapsible>
                    
                    <div className="mt-6 space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-md">Distritos</h4>
                            <button onClick={() => addDistrict(province.id)} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-semibold"><PlusCircleIcon className="w-4 h-4"/>Añadir Distrito</button>
                        </div>

                        {province.districts.map(district => (
                            <Collapsible key={district.id} title={<span className="font-semibold text-md">{district.name}</span>} headerClassName="bg-gray-50 dark:bg-gray-700/50" defaultOpen>
                                <div className="p-3">
                                    <h5 className="font-semibold text-sm mb-2 text-yellow-600 dark:text-yellow-400">Alcalde Distrital</h5>
                                    <PersonCard person={district.mayor} type="mayor" />
                                    <Collapsible title="Regidores Distritales" headerClassName="text-xs">
                                        {district.mayor.councilors.map(c => <PersonCard key={c.id} person={c} type="counselor" />)}
                                        <button onClick={() => addDistrictCouncilor(province.id, district.id)} className="w-full text-left p-2 text-xs text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700/50 flex items-center gap-1"><PlusCircleIcon className="w-4 h-4"/>Añadir Regidor</button>
                                    </Collapsible>
                                </div>
                            </Collapsible>
                        ))}
                    </div>
                </div>
            </Collapsible>
        ))}
      </div>
    </div>
  );
};