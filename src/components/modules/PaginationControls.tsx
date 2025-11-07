import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  viewMode: 'single' | 'all';
  onPageChange?: (page: number) => void;
  setCurrentPage?: (page: number) => void;
  onViewModeChange: (mode: 'single' | 'all') => void;
  isDarkMode: boolean;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  viewMode,
  onPageChange,
  setCurrentPage,
  onViewModeChange,
  isDarkMode
}) => {
  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else if (setCurrentPage) {
      setCurrentPage(page);
    }
  };

  // Ne rien afficher si les valeurs ne sont pas valides
  if (!totalPages || totalPages < 1) {
    return null;
  }

  // Style du conteneur
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '4px 8px',
  };

  // Style des boutons
  const buttonStyle = {
    padding: '6px 10px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: isDarkMode ? '#475569' : '#d1d5db',
    borderRadius: '6px',
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    color: isDarkMode ? '#f1f5f9' : '#374151',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  const activeButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
    color: '#ffffff',
    borderColor: '#6b7280',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    opacity: 0.5,
    cursor: 'not-allowed',
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    color: isDarkMode ? '#6b7280' : '#9ca3af',
  };

  
  // Déterminer si les boutons de navigation doivent être désactivés en mode "voir tout"
  const isNavigationDisabled = viewMode === 'all' || totalPages <= 1;

  return (
    <div style={containerStyle}>
      {/* Bouton précédent */}
      <button
        style={!isNavigationDisabled && currentPage > 1 ? buttonStyle : disabledButtonStyle}
        onClick={() => !isNavigationDisabled && currentPage > 1 && handlePageChange(currentPage - 1)}
        disabled={isNavigationDisabled || currentPage <= 1}
        title="Page précédente"
        aria-label={`Go to page ${currentPage + 1}`}      >
        <ChevronLeftIcon style={{ width: '12px', height: '12px' }} />
        Précédent
      </button>

      
      {/* Bouton suivant */}
      <button
        style={!isNavigationDisabled && currentPage < totalPages ? buttonStyle : disabledButtonStyle}
        onClick={() => !isNavigationDisabled && currentPage < totalPages && handlePageChange(currentPage + 1)}
        disabled={isNavigationDisabled || currentPage >= totalPages}
        title="Page suivante"
        aria-label={`Go to page ${currentPage - 1}`}
        
      >
        Suivant
        <ChevronRightIcon style={{ width: '12px', height: '12px' }} />
      </button>

      {/* Séparateur */}
      <div style={{
        width: '1px',
        height: '20px',
        backgroundColor: isDarkMode ? '#475569' : '#d1d5db',
        margin: '0 6px'
      }} />

      {/* Bouton toggle mode vue - toujours visible */}
      <button
        style={activeButtonStyle}
        onClick={() => onViewModeChange(viewMode === 'single' ? 'all' : 'single')}
        title={viewMode === 'single' ? 'Afficher toutes les pages' : 'Afficher une page à la fois'}
      >
        {viewMode === 'single' ? 'Voir tout' : 'Vue page'}
      </button>
    </div>
  );
};

export default PaginationControls;