
import React, { useState, ReactNode } from 'react';
import { ChevronDownIcon } from './Icons';

interface CollapsibleProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  headerClassName?: string;
}

export const Collapsible: React.FC<CollapsibleProps> = ({ title, children, defaultOpen = false, headerClassName = '' }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center p-3 text-left focus:outline-none transition-colors duration-200 ${headerClassName}`}
      >
        <div className="flex-grow">{title}</div>
        <ChevronDownIcon className={`w-5 h-5 transition-transform transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800/50">
          {children}
        </div>
      )}
    </div>
  );
};
