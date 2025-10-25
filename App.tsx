import React, { useState } from 'react';
import { SituationalStatusTab } from './components/SituationalStatusTab';
import { RegionalBodyTab } from './components/RegionalBodyTab';
import { ActivityPlannerTab } from './components/ActivityPlannerTab';
import { CoordinatorsTab } from './components/CoordinatorsTab';
import {
  initialSituationalStatusData,
  initialRegionalBodyData,
  initialPlannerData,
  initialCoordinatorsData
} from './constants';
import type { SituationalStatusData, RegionalBodyData, PlannerEvent, Coordinator } from './types';

type Tab = 'situational' | 'regional' | 'planner' | 'coordinators';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('situational');
  const [situationalData, setSituationalData] = useState<SituationalStatusData>(initialSituationalStatusData);
  const [regionalData, setRegionalData] = useState<RegionalBodyData>(initialRegionalBodyData);
  const [plannerData, setPlannerData] = useState<PlannerEvent[]>(initialPlannerData);
  const [coordinatorsData, setCoordinatorsData] = useState<Coordinator[]>(initialCoordinatorsData);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'situational':
        return <SituationalStatusTab 
                  data={situationalData} 
                  setData={setSituationalData}
                  events={plannerData}
                  setEvents={setPlannerData}
                />;
      case 'regional':
        return <RegionalBodyTab data={regionalData} setData={setRegionalData} />;
      case 'planner':
        return <ActivityPlannerTab events={plannerData} setEvents={setPlannerData} />;
      case 'coordinators':
        return <CoordinatorsTab coordinators={coordinatorsData} setCoordinators={setCoordinatorsData} />;
      default:
        return null;
    }
  };

  const TabButton: React.FC<{ tabId: Tab; label: string }> = ({ tabId, label }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
        activeTab === tabId
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <header className="mb-6 no-print">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Bravo22-Ancash</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Dashboard de Elecciones Regionales y Municipales 2026</p>
        </header>
        
        <div className="border-b border-gray-300 dark:border-gray-600 no-print">
          <nav className="-mb-px flex space-x-2" aria-label="Tabs">
            <TabButton tabId="situational" label="Estado Situacional" />
            <TabButton tabId="regional" label="Órgano Regional" />
            <TabButton tabId="planner" label="Planificador de Actividades" />
            <TabButton tabId="coordinators" label="Coordinadores" />
          </nav>
        </div>
        
        <main className="mt-4 printable-content">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default App;