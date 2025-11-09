import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import {
  PencilIcon,
  ArrowDownTrayIcon,
  BookOpenIcon,
  ArchiveBoxIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  Cog6ToothIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import HeaderSkeleton from './HeaderSkeleton';
import OptimizedImage from '../ui/OptimizedImage';

// Icônes inline légères pour réduire le JS critique
const SvgSun = ({ className = 'w-4 h-4', ariaHidden = true }: { className?: string; ariaHidden?: boolean }) => (
  <svg className={className} aria-hidden={ariaHidden} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const SvgMoon = ({ className = 'w-4 h-4', ariaHidden = true }: { className?: string; ariaHidden?: boolean }) => (
  <svg className={className} aria-hidden={ariaHidden} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

interface HeaderProps {
  title: string;
  showImport?: boolean;
  showTemplates?: boolean;
  showExport?: boolean;
  isDarkMode: boolean;
  isLoading?: boolean;
  mode?: 'global' | 'converter'; // Nouveau mode pour différencier la navigation
  onTabChange?: (tab: 'editor' | 'import' | 'templates' | 'export') => void;
  onThemeToggle: () => void;
  onAdvancedExport?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  showImport = false,
  showTemplates = false,
  showExport = false,
  isDarkMode,
  isLoading = false,
  mode = 'converter',
  onTabChange,
  onThemeToggle,
  onAdvancedExport
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // État pour le menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false); // Fermer le menu si on passe en desktop
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Navigation globale
  const handleGlobalNavigation = (path: string) => {
    navigate({ to: path });
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  // Fermer le menu mobile lors d'un clic sur un onglet
  const handleTabClick = (tab: 'editor' | 'import' | 'templates' | 'export') => {
    onTabChange?.(tab);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  // Optimisation: Mémoriser les classes de boutons pour éviter les re-rendus
  const getTabButtonClasses = useCallback((isActive: boolean) => {
    const baseClasses = `px-5 py-1 border border-b-2 rounded-t-lg text-sm font-medium cursor-pointer transition-all duration-200 flex items-center justify-start gap-0 outline-none appearance-none transform translate-y-0 hover:translate-y-[-1px] hover:shadow-lg ${
      isMobile ? 'min-w-[80px] px-3' : 'min-w-[120px]'
    }`;

    if (isActive) {
      return `${baseClasses} bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-600 border-b-gray-600 dark:border-gray-500 dark:border-b-gray-500`;
    }

    return `${baseClasses} ${isDarkMode
      ? 'bg-gray-800 text-gray-100 border-gray-600 border-b-transparent hover:bg-gray-700 hover:border-b-gray-500'
      : 'bg-white text-gray-900 border-gray-300 border-b-transparent hover:bg-gray-50 hover:border-b-gray-400'
    }`;
  }, [isDarkMode, isMobile]);

  // Optimisation: Mémoriser les classes du header
  const headerClasses = useMemo(() => {
    return `
      ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}
      px-4 py-1 border-b flex justify-between items-center sticky top-0 z-[100]
      ${isDarkMode ? 'shadow-[0_2px_8px_rgba(0,0,0,0.3)]' : 'shadow-[0_2px_8px_rgba(0,0,0,0.1)]'}
    `;
  }, [isDarkMode]);

  // Optimisation: Mémoriser les états des onglets
  const tabStates = useMemo(() => ({
    isEditorActive: !showTemplates && !showExport && !showImport,
    isImportActive: showImport,
    isTemplatesActive: showTemplates
  }), [showTemplates, showExport, showImport]);

 

  // Afficher le skeleton pendant le chargement
  if (isLoading) {
    return <HeaderSkeleton isDarkMode={isDarkMode} />;
  }

  return (
    <header className={headerClasses}>
      <div className="flex items-center gap-3">
        <OptimizedImage
          src="./images/logo.webp"
          alt="MDtoPDF Pro - Logo"
          className="h-8 w-auto mr-3 object-contain"
          height={42}
          loadingStrategy="eager"
        />
        
      </div>

      {/* Navigation Desktop */}
      {!isMobile && (
        <nav
          className="flex gap-[2px] items-end"
          role="tablist"
          aria-label="Navigation principale de l'application"
        >
          {/* Navigation globale */}
          {mode === 'global' ? (
            <div className="flex gap-[2px] items-end" role="group" aria-label="Navigation globale">
              <button
                className={getTabButtonClasses(location.pathname === '/')}
                onClick={() => handleGlobalNavigation('/')}
                role="tab"
                aria-selected={location.pathname === '/'}
                aria-label="Page d'accueil"
                title="Aller à la page d'accueil"
              >
                <HomeIcon className="w-4 h-4 mr-1.5 flex-shrink-0" aria-hidden="true" />
                <span>Accueil</span>
              </button>
              <button
                className={getTabButtonClasses(location.pathname === '/converter')}
                onClick={() => handleGlobalNavigation('/converter')}
                role="tab"
                aria-selected={location.pathname === '/converter'}
                aria-label="Convertisseur Markdown vers PDF"
                title="Aller au convertisseur"
              >
                <DocumentTextIcon className="w-4 h-4 mr-1.5 flex-shrink-0" aria-hidden="true" />
                <span>Convertisseur</span>
              </button>
              <button
                className={getTabButtonClasses(location.pathname.startsWith('/templates'))}
                onClick={() => handleGlobalNavigation('/templates')}
                role="tab"
                aria-selected={location.pathname.startsWith('/templates')}
                aria-label="Templates et modèles"
                title="Voir les templates"
              >
                <BookOpenIcon className="w-4 h-4 mr-1.5 flex-shrink-0" aria-hidden="true" />
                <span>Templates</span>
              </button>
              {/* Onglet Exports retiré */}
              <button
                className={getTabButtonClasses(location.pathname === '/settings')}
                onClick={() => handleGlobalNavigation('/settings')}
                role="tab"
                aria-selected={location.pathname === '/settings'}
                aria-label="Paramètres et configuration"
                title="Aller aux paramètres"
              >
                <Cog6ToothIcon className="w-4 h-4 mr-1.5 flex-shrink-0" aria-hidden="true" />
                <span>Paramètres</span>
              </button>
            </div>
          ) : (
            /* Navigation du convertisseur */
            <div className="flex gap-[2px] items-end" role="group" aria-label="Onglets de fonctionnalités">
              <button
                className={getTabButtonClasses(tabStates.isEditorActive)}
                onClick={() => handleTabClick('editor')}
                role="tab"
                aria-selected={tabStates.isEditorActive}
                aria-controls="editor-panel"
                aria-label="Onglet Éditeur - Rédiger et modifier du texte Markdown"
                title="Basculer vers l'éditeur Markdown"
              >
                <PencilIcon className="w-4 h-4 mr-1.5 flex-shrink-0" aria-hidden="true" />
                <span>Éditeur</span>
              </button>
              <button
                className={getTabButtonClasses(tabStates.isImportActive)}
                onClick={() => handleTabClick('import')}
                role="tab"
                aria-selected={tabStates.isImportActive}
                aria-controls="editor-panel"
                aria-label="Onglet Importer - Importer des fichiers Markdown existants"
                title="Importer un fichier Markdown"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-1.5 flex-shrink-0" aria-hidden="true" />
                <span>Importer</span>
              </button>
              <button
                className={getTabButtonClasses(tabStates.isTemplatesActive)}
                onClick={() => handleTabClick('templates')}
                role="tab"
                aria-selected={tabStates.isTemplatesActive}
                aria-controls="editor-panel"
                aria-label="Onglet Templates - Choisir un modèle de document prédéfini"
                title="Parcourir les templates disponibles"
              >
                <BookOpenIcon className="w-4 h-4 mr-1.5 flex-shrink-0" aria-hidden="true" />
                <span>Templates</span>
              </button>
            </div>
          )}

          {/* Espacement entre les onglets et les contrôles */}
          <div className="w-4" />

          {/* Groupe des contrôles d'action */}
          <div className="flex items-center gap-2" role="group" aria-label="Contrôles d'action">
            <button
              className={`
                flex items-center gap-2 px-4 py-1 rounded-lg text-sm cursor-pointer
                transition-all duration-200 outline-none
                ${isDarkMode
                  ? 'bg-gray-800 border-gray-600 text-gray-100'
                  : 'bg-white border-gray-300 text-gray-900'
                }
                border
              `}
              onClick={onThemeToggle}
              aria-label={isDarkMode ? "Basculer vers le mode clair" : "Basculer vers le mode sombre"}
              aria-pressed={isDarkMode}
              title={isDarkMode ? "Activer le mode clair pour une meilleure lisibilité en journée" : "Activer le mode sombre pour réduire la fatigue oculaire"}
            >
              {isDarkMode ? (
                <>
                  <SvgSun className="w-4 h-4" ariaHidden={true} />
                  <span>Clair</span>
                </>
              ) : (
                <>
                  <SvgMoon className="w-4 h-4" ariaHidden={true} />
                  <span>Sombre</span>
                </>
              )}
            </button>

            {mode === 'converter' && onAdvancedExport && (
              <button
                className="ml-2 flex items-center gap-1.5 px-4 py-1 bg-gradient-to-r from-gray-500 to-gray-600 border-0 rounded-lg text-white text-sm font-semibold cursor-pointer transition-all duration-200 outline-none hover:from-gray-600 hover:to-gray-700 hover:transform hover:translate-y-[-1px] hover:shadow-lg active:scale-95 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={onAdvancedExport}
                title="Export avancé multi-formats - PDF, HTML, DOCX, Markdown"
                aria-label="Ouvrir le panneau d'export avancé pour exporter dans plusieurs formats (PDF, HTML, DOCX, Markdown)"
                aria-expanded="false"
                aria-haspopup="dialog"
              >
                <ArchiveBoxIcon className="w-4 h-4 mr-1.5 flex-shrink-0" aria-hidden="true" />
                <span>Export+</span>
              </button>
            )}
          </div>
        </nav>
      )}

      {/* Navigation Mobile */}
      {isMobile && (
        <div className="flex items-center gap-2">
          {/* Bouton du menu hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-lg border transition-all duration-200 ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600 text-gray-100 hover:bg-gray-700'
                : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
            }`}
            aria-label={isMobileMenuOpen ? "Fermer le menu de navigation" : "Ouvrir le menu de navigation"}
            aria-expanded={isMobileMenuOpen}
            aria-haspopup="true"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Bars3Icon className="w-5 h-5" aria-hidden="true" />
            )}
          </button>

          {/* Bouton thème mobile */}
          <button
            className={`
              flex items-center gap-1 px-3 py-2 rounded-lg text-sm cursor-pointer
              transition-all duration-200 outline-none
              ${isDarkMode
                ? 'bg-gray-800 border-gray-600 text-gray-100'
                : 'bg-white border-gray-300 text-gray-900'
              }
              border
            `}
            onClick={onThemeToggle}
            aria-label={isDarkMode ? "Basculer vers le mode clair" : "Basculer vers le mode sombre"}
            aria-pressed={isDarkMode}
          >
            {isDarkMode ? (
              <SvgSun className="w-4 h-4" ariaHidden={true} />
            ) : (
              <SvgMoon className="w-4 h-4" ariaHidden={true} />
            )}
          </button>
        </div>
      )}

      {/* Menu mobile déroulant */}
      {isMobile && isMobileMenuOpen && (
        <div
          className={`absolute top-full left-0 right-0 border-b shadow-lg z-50 transition-all duration-300 ${
            isDarkMode
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-gray-200'
          }`}
          role="menu"
          aria-label="Menu de navigation mobile"
        >
          <nav className="flex flex-col p-2" role="tablist" aria-label="Navigation mobile">
            {mode === 'global' ? (
              /* Navigation globale mobile */
              <>
                <button
                  className={`flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                    location.pathname === '/'
                      ? 'bg-blue-600 text-white'
                      : isDarkMode
                        ? 'text-gray-100 hover:bg-gray-700'
                        : 'text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => handleGlobalNavigation('/')}
                  role="tab"
                  aria-selected={location.pathname === '/'}
                >
                  <HomeIcon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <span>Accueil</span>
                </button>
                <button
                  className={`flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                    location.pathname === '/converter'
                      ? 'bg-blue-600 text-white'
                      : isDarkMode
                        ? 'text-gray-100 hover:bg-gray-700'
                        : 'text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => handleGlobalNavigation('/converter')}
                  role="tab"
                  aria-selected={location.pathname === '/converter'}
                >
                  <DocumentTextIcon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <span>Convertisseur</span>
                </button>
                <button
                  className={`flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                    location.pathname.startsWith('/templates')
                      ? 'bg-blue-600 text-white'
                      : isDarkMode
                        ? 'text-gray-100 hover:bg-gray-700'
                        : 'text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => handleGlobalNavigation('/templates')}
                  role="tab"
                  aria-selected={location.pathname.startsWith('/templates')}
                >
                  <BookOpenIcon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <span>Templates</span>
                </button>
                {/* Onglet Exports retiré (mobile global) */}
                <button
                  className={`flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                    location.pathname === '/settings'
                      ? 'bg-blue-600 text-white'
                      : isDarkMode
                        ? 'text-gray-100 hover:bg-gray-700'
                        : 'text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => handleGlobalNavigation('/settings')}
                  role="tab"
                  aria-selected={location.pathname === '/settings'}
                >
                  <Cog6ToothIcon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <span>Paramètres</span>
                </button>
              </>
            ) : (
              /* Navigation du convertisseur mobile */
              <>
                <button
                  className={`flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                    tabStates.isEditorActive
                      ? 'bg-blue-600 text-white'
                      : isDarkMode
                        ? 'text-gray-100 hover:bg-gray-700'
                        : 'text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => handleTabClick('editor')}
                  role="tab"
                  aria-selected={tabStates.isEditorActive}
                  aria-controls="editor-panel"
                >
                  <PencilIcon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <span>Éditeur</span>
                </button>
                <button
                  className={`flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                    tabStates.isImportActive
                      ? 'bg-blue-600 text-white'
                      : isDarkMode
                        ? 'text-gray-100 hover:bg-gray-700'
                        : 'text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => handleTabClick('import')}
                  role="tab"
                  aria-selected={tabStates.isImportActive}
                  aria-controls="editor-panel"
                >
                  <ArrowDownTrayIcon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <span>Importer</span>
                </button>
                <button
                  className={`flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                    tabStates.isTemplatesActive
                      ? 'bg-blue-600 text-white'
                      : isDarkMode
                        ? 'text-gray-100 hover:bg-gray-700'
                        : 'text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => handleTabClick('templates')}
                  role="tab"
                  aria-selected={tabStates.isTemplatesActive}
                  aria-controls="editor-panel"
                >
                  <BookOpenIcon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <span>Templates</span>
                </button>

                {/* Séparateur */}
                <div className={`border-t my-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`} />

                {/* Export avancé mobile */}
                {onAdvancedExport && (
                  <button
                    className={`flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                      isDarkMode
                        ? 'text-gray-100 hover:bg-gray-700'
                        : 'text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      onAdvancedExport();
                      setIsMobileMenuOpen(false);
                    }}
                    aria-label="Ouvrir l'export avancé"
                  >
                    <ArchiveBoxIcon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                    <span>Export avancé</span>
                  </button>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
