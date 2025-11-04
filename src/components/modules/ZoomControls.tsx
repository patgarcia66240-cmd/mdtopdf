import React from 'react';
import { MinusIcon, PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface ZoomControlsProps {
  previewZoom: number;
  onZoomChange: (zoom: number) => void;
  isDarkMode: boolean;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({
  previewZoom,
  onZoomChange,
  isDarkMode
}) => {
  const baseButtonStyle = {
    padding: '4px 6px',
    border: '1px solid ' + (isDarkMode ? '#475569' : '#d1d5db'),
    borderRadius: '4px',
    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
    color: isDarkMode ? '#f1f5f9' : '#1f2937',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s ease',
    fontSize: '12px'
  };

  const handleZoomOutClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onZoomChange(Math.max(50, previewZoom - 10));
    // Effet hover manuel
    e.currentTarget.style.backgroundColor = isDarkMode ? '#4b5563' : '#e5e7eb';
    e.currentTarget.style.transform = 'scale(0.95)';
    setTimeout(() => {
      e.currentTarget.style.backgroundColor = isDarkMode ? '#0f172a' : '#ffffff';
      e.currentTarget.style.transform = 'scale(1)';
    }, 150);
  };

  const handleZoomInClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onZoomChange(Math.min(150, previewZoom + 10));
    // Effet hover manuel
    e.currentTarget.style.backgroundColor = isDarkMode ? '#4b5563' : '#e5e7eb';
    e.currentTarget.style.transform = 'scale(0.95)';
    setTimeout(() => {
      e.currentTarget.style.backgroundColor = isDarkMode ? '#0f172a' : '#ffffff';
      e.currentTarget.style.transform = 'scale(1)';
    }, 150);
  };

  const handleResetClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onZoomChange(100);
    // Effet hover manuel
    e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#e2e8f0';
    e.currentTarget.style.transform = 'scale(0.95) rotate(180deg)';
    setTimeout(() => {
      e.currentTarget.style.backgroundColor = isDarkMode ? '#1e293b' : '#f1f5f9';
      e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
    }, 300);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginLeft: '32px'
    }}>
      <button
        onClick={handleZoomOutClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = isDarkMode ? '#4b5563' : '#e5e7eb';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isDarkMode ? '#0f172a' : '#ffffff';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        style={baseButtonStyle}
        title="Zoom arrière"
      >
        <MinusIcon style={{ width: '14px', height: '14px' }} />
      </button>

      <span style={{
        fontSize: '12px',
        fontWeight: '600',
        color: isDarkMode ? '#94a3b8' : '#64748b',
        minWidth: '45px',
        textAlign: 'center',
        padding: '4px 8px',
        backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
        borderRadius: '4px',
        border: '1px solid ' + (isDarkMode ? '#334155' : '#e2e8f0')
      }}>
        {previewZoom}%
      </span>

      <button
        onClick={handleZoomInClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = isDarkMode ? '#4b5563' : '#e5e7eb';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isDarkMode ? '#0f172a' : '#ffffff';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        style={baseButtonStyle}
        title="Zoom avant"
      >
        <PlusIcon style={{ width: '14px', height: '14px' }} />
      </button>

      <button
        onClick={handleResetClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#e2e8f0';
          e.currentTarget.style.transform = 'translateY(-1px) rotate(90deg)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isDarkMode ? '#1e293b' : '#f1f5f9';
          e.currentTarget.style.transform = 'translateY(0) rotate(0deg)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        style={{
          ...baseButtonStyle,
          padding: '4px 8px',
          background: isDarkMode ? '#1e293b' : '#f1f5f9',
          border: '1px solid ' + (isDarkMode ? '#475569' : '#d1d5db'),
          transition: 'transform 0.3s ease'
        }}
        title="Réinitialiser le zoom"
      >
        <ArrowPathIcon style={{
          width: '12px',
          height: '12px',
          transition: 'transform 0.3s ease'
        }} />
      </button>
    </div>
  );
};

export default ZoomControls;