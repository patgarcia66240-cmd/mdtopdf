import React, { useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  title: string;
  showImport: boolean;
  showTemplates: boolean;
  showExport: boolean;
  isDarkMode: boolean;
  onTabChange: (tab: 'editor' | 'import' | 'templates' | 'export') => void;
  onThemeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showImport,
  showTemplates,
  showExport,
  isDarkMode,
  onTabChange,
  onThemeToggle
}) => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  // Styles
  const headerStyle = {
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    padding: '8px 16px',
    borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
    boxShadow: isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: isDarkMode ? '#f1f5f9' : '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const navigationStyle = {
    display: 'flex',
    gap: '2px', // Réduire l'espacement pour les onglets Windows
    alignItems: 'flex-end'
  };

  const tabsContainerStyle = {
    display: 'flex',
    gap: '2px',
    alignItems: 'flex-end'
  };

  const spacerStyle = {
    width: '16px' // Espacement entre les onglets et le bouton mode
  };

  const navButtonStyle = (isActive: boolean, isHovered: boolean = false) => ({
    padding: '8px 24px', // Augmenter le padding horizontal pour des onglets plus larges
    background: isActive
      ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
      : (isHovered
          ? (isDarkMode ? '#4b5563' : '#e2e8f0')
          : (isDarkMode ? '#374151' : '#f1f5f9')),
    color: isActive ? '#ffffff' : (isDarkMode ? '#f1f5f9' : '#374151'),
    border: 'none',
    borderRadius: '8px 8px 0 0', // Style onglet Windows - arrondi seulement en haut
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderBottom: isActive
      ? `2px solid ${isDarkMode ? '#4b5563' : '#6b7280'}`
      : (isHovered
          ? `2px solid ${isDarkMode ? '#6b7280' : '#9ca3af'}`
          : `2px solid transparent`),
    minWidth: '100px', // Largeur minimale pour assurer une taille cohérente
    transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
    boxShadow: isHovered
      ? '0 2px 8px rgba(0, 0, 0, 0.15)'
      : 'none'
  });

  const themeButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: isDarkMode ? '#374151' : '#f1f5f9',
    border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
    borderRadius: '8px',
    color: isDarkMode ? '#f1f5f9' : '#374151',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const getHeaderIcon = () => {
    if (showImport) {
      return '📥';
    }
    if (showTemplates) {
      return '📚';
    }
    if (showExport) {
      return '📤';
    }
    return '🚀';
  };

  return (
    <div style={headerStyle}>
      <div style={titleStyle}>
        <img
          src="./images/logo.png"
          alt="Logo"
          style={{
            height: '48px',
            width: 'auto',
            marginRight: '12px',
            objectFit: 'contain'
          }}
        />
      </div>

      <div style={navigationStyle}>
        {/* Conteneur des onglets Windows */}
        <div style={tabsContainerStyle}>
          <button
            style={navButtonStyle(!showTemplates && !showExport && !showImport, hoveredTab === 'editor')}
            onClick={() => onTabChange('editor')}
            onMouseEnter={() => setHoveredTab('editor')}
            onMouseLeave={() => setHoveredTab(null)}
          >
            Éditeur
          </button>
          <button
            style={navButtonStyle(showImport, hoveredTab === 'import')}
            onClick={() => onTabChange('import')}
            onMouseEnter={() => setHoveredTab('import')}
            onMouseLeave={() => setHoveredTab(null)}
          >
            Importer
          </button>
          <button
            style={navButtonStyle(showTemplates, hoveredTab === 'templates')}
            onClick={() => onTabChange('templates')}
            onMouseEnter={() => setHoveredTab('templates')}
            onMouseLeave={() => setHoveredTab(null)}
          >
            Templates
          </button>
        </div>

        {/* Espacement entre les onglets et le bouton mode */}
        <div style={spacerStyle} />

        <button
          style={themeButtonStyle}
          onClick={onThemeToggle}
        >
          {isDarkMode ? (
            <>
              <SunIcon style={{ width: '16px', height: '16px' }} />
              Clair
            </>
          ) : (
            <>
              <MoonIcon style={{ width: '16px', height: '16px' }} />
              Sombre
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Header;