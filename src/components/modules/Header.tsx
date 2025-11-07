import React, { useState } from 'react';
import {
  SunIcon,
  MoonIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  BookOpenIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';

interface HeaderProps {
  title: string;
  showImport: boolean;
  showTemplates: boolean;
  showExport: boolean;
  isDarkMode: boolean;
  onTabChange: (tab: 'editor' | 'import' | 'templates' | 'export') => void;
  onThemeToggle: () => void;
  onAdvancedExport?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showImport,
  showTemplates,
  showExport,
  isDarkMode,
  onTabChange,
  onThemeToggle,
  onAdvancedExport
}) => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  // Déterminer les classes Tailwind pour les boutons d'onglets
  const getTabButtonClasses = (isActive: boolean) => {
    const baseClasses = "px-5 py-2 border-0 rounded-t-lg text-sm font-medium cursor-pointer transition-all duration-200 border-b-2 min-w-[120px] flex items-center justify-start gap-0 outline-none appearance-none transform translate-y-0 hover:translate-y-[-1px] hover:shadow-lg";

    if (isActive) {
      return `${baseClasses} bg-gradient-to-r from-gray-500 to-gray-600 text-white border-b-gray-600 dark:border-b-gray-500`;
    }

    return `${baseClasses} ${isDarkMode
      ? 'bg-gray-700 text-gray-100 border-b-transparent hover:bg-gray-600 hover:border-b-gray-500'
      : 'bg-gray-50 text-gray-700 border-b-transparent hover:bg-gray-200 hover:border-b-gray-400'
    }`;
  };

 

  return (
    <header className={`
      ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}
      px-4 py-2 border-b flex justify-between items-center sticky top-0 z-[100]
      ${isDarkMode ? 'shadow-[0_2px_8px_rgba(0,0,0,0.3)]' : 'shadow-[0_2px_8px_rgba(0,0,0,0.1)]'}
    `}>
      <div className="flex items-center gap-3">
        <img
          src="./images/logo.png"
          alt="MDtoPDF Pro - Logo"
          className="h-12 w-auto mr-3 object-contain"
        />
        <h1 className={`m-0 text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
          MDtoPDF Pro
        </h1>
      </div>

      <nav className="flex gap-[2px] items-end">
        {/* Conteneur des onglets Windows */}
        <div className="flex gap-[2px] items-end">
          <button
            className={getTabButtonClasses(!showTemplates && !showExport && !showImport)}
            onClick={() => onTabChange('editor')}
            onMouseEnter={() => setHoveredTab('editor')}
            onMouseLeave={() => setHoveredTab(null)}
          >
            <PencilIcon className="w-4 h-4 mr-1.5 flex-shrink-0" aria-hidden="true" />
            <span>Éditeur</span>
          </button>
          <button
            className={getTabButtonClasses(showImport)}
            onClick={() => onTabChange('import')}
            onMouseEnter={() => setHoveredTab('import')}
            onMouseLeave={() => setHoveredTab(null)}
          >
            <ArrowDownTrayIcon className="w-4 h-4 mr-1.5 flex-shrink-0" aria-hidden="true" />
            <span>Importer</span>
          </button>
          <button
            className={getTabButtonClasses(showTemplates)}
            onClick={() => onTabChange('templates')}
            onMouseEnter={() => setHoveredTab('templates')}
            onMouseLeave={() => setHoveredTab(null)}
          >
            <BookOpenIcon className="w-4 h-4 mr-1.5 flex-shrink-0" aria-hidden="true" />
            <span>Templates</span>
          </button>
        </div>

        {/* Espacement entre les onglets et le bouton mode */}
        <div className="w-4" />

        <button
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm cursor-pointer
            transition-all duration-200 outline-none
            ${isDarkMode
              ? 'bg-gray-700 border-gray-600 text-gray-100'
              : 'bg-gray-50 border-gray-300 text-gray-700'
            }
            border
          `}
          onClick={onThemeToggle}
        >
          {isDarkMode ? (
            <>
              <SunIcon className="w-4 h-4" aria-hidden="true" />
              <span>Clair</span>
            </>
          ) : (
            <>
              <MoonIcon className="w-4 h-4" aria-hidden="true" />
              <span>Sombre</span>
            </>
          )}
        </button>

        {onAdvancedExport && (
          <button
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 border-blue-500 rounded-lg text-white text-sm font-semibold cursor-pointer transition-all duration-200 outline-none hover:bg-blue-600 border"
            onClick={onAdvancedExport}
            title="Export avancé multi-formats"
          >
            <ArchiveBoxIcon className="w-4 h-4 mr-1.5 flex-shrink-0" aria-hidden="true" />
            <span>Export+</span>
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;