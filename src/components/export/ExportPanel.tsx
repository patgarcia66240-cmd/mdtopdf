import React, { useState } from 'react';
import { useExport, useSupportedFormats } from '@/hooks/api/useExport';
import { ExportFormat } from '@/services/exportService';
import { useAppStore } from '@/stores/appStore';
import {
  ArrowDownTrayIcon,
  DocumentIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface ExportPanelProps {
  isDarkMode: boolean;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ isDarkMode }) => {
  const { exportToFormat, isExporting, exportError } = useExport();
  const { formats } = useSupportedFormats();
  const { markdown, getWordCount, getEstimatedPages } = useAppStore();
  const [customFilename, setCustomFilename] = useState('document');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    try {
      setShowSuccess(false);
      await exportToFormat(format);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // Cache le message après 3s
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const containerStyle = {
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    border: `1px solid ${isDarkMode ? '#374151' : '#d1d5db'}`,
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
  };

  const titleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: isDarkMode ? '#e5e7eb' : '#1f2937',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const formatCardStyle = (isAvailable: boolean) => ({
    border: `1px solid ${isAvailable ? (isDarkMode ? '#374151' : '#e5e7eb') : (isDarkMode ? '#4b5563' : '#d1d5db')}`,
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '8px',
    opacity: isAvailable ? 1 : 0.6,
    cursor: isAvailable && !isExporting ? 'pointer' : 'not-allowed',
    transition: 'all 0.2s ease',
    backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
  });

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    padding: '8px 12px',
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
    borderRadius: '4px',
    color: isDarkMode ? '#e5e7eb' : '#1f2937',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'left' as const,
    transition: 'all 0.2s ease',
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    opacity: 0.5,
    cursor: 'not-allowed',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
    borderRadius: '6px',
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    color: isDarkMode ? '#e5e7eb' : '#1f2937',
    fontSize: '14px',
    marginBottom: '16px',
  };

  const hasContent = markdown.trim().length > 0;
  const wordCount = getWordCount();
  const estimatedPages = getEstimatedPages();

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>
        <ArrowDownTrayIcon className="w-5 h-5" />
        Exporter le document
      </div>

      {/* Informations sur le document */}
      <div style={{
        padding: '12px',
        backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
        borderRadius: '6px',
        marginBottom: '16px',
        fontSize: '12px',
        color: isDarkMode ? '#d1d5db' : '#4b5563',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>Mots:</span>
          <span style={{ fontWeight: '600' }}>{wordCount.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>Pages estimées:</span>
          <span style={{ fontWeight: '600' }}>{estimatedPages}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Caractères:</span>
          <span style={{ fontWeight: '600' }}>{markdown.length.toLocaleString()}</span>
        </div>
      </div>

      {/* Nom du fichier personnalisé */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: '500',
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          marginBottom: '4px',
        }}>
          Nom du fichier
        </label>
        <input
          type="text"
          value={customFilename}
          onChange={(e) => setCustomFilename(e.target.value)}
          placeholder="document"
          disabled={!hasContent || isExporting}
          style={{
            ...inputStyle,
            opacity: !hasContent ? 0.5 : 1,
          }}
        />
      </div>

      {/* Messages d'état */}
      {exportError && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px',
          backgroundColor: isDarkMode ? '#7f1d1d' : '#fef2f2',
          border: `1px solid ${isDarkMode ? '#991b1b' : '#fecaca'}`,
          borderRadius: '6px',
          marginBottom: '16px',
          fontSize: '12px',
          color: isDarkMode ? '#fca5a5' : '#991b1b',
        }}>
          <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0" />
          <span>Erreur lors de l'export: {exportError.message}</span>
        </div>
      )}

      {showSuccess && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px',
          backgroundColor: isDarkMode ? '#14532d' : '#f0fdf4',
          border: `1px solid ${isDarkMode ? '#166534' : '#bbf7d0'}`,
          borderRadius: '6px',
          marginBottom: '16px',
          fontSize: '12px',
          color: isDarkMode ? '#86efac' : '#166534',
        }}>
          <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
          <span>Document exporté avec succès !</span>
        </div>
      )}

      {/* Formats d'export disponibles */}
      <div style={{ marginBottom: '12px' }}>
        <h4 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: isDarkMode ? '#e5e7eb' : '#1f2937',
          marginBottom: '8px',
        }}>
          Formats disponibles
        </h4>

        {formats.map((format) => {
          const isAvailable = hasContent && !isExporting;

          return (
            <div
              key={format.value}
              style={formatCardStyle(isAvailable)}
              onMouseEnter={(e) => {
                if (isAvailable) {
                  e.currentTarget.style.backgroundColor = isDarkMode ? '#4b5563' : '#f3f4f6';
                  e.currentTarget.style.borderColor = '#2563eb';
                }
              }}
              onMouseLeave={(e) => {
                if (isAvailable) {
                  e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#f9fafb';
                  e.currentTarget.style.borderColor = isDarkMode ? '#374151' : '#e5e7eb';
                }
              }}
              onClick={() => isAvailable && handleExport(format.value)}
            >
              <button
                style={isAvailable ? buttonStyle : disabledButtonStyle}
                disabled={!isAvailable}
                type="button"
              >
                <span style={{ fontSize: '18px' }}>
                  {format.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '600',
                    marginBottom: '2px',
                  }}>
                    {format.label}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: isDarkMode ? '#9ca3af' : '#6b7280',
                    lineHeight: '1.3',
                  }}>
                    {format.description}
                  </div>
                </div>
                <ArrowDownTrayIcon className="w-4 h-4" style={{
                  opacity: isExporting ? 0.5 : 1,
                }} />
              </button>

              {isExporting && (
                <div style={{
                  marginTop: '8px',
                  fontSize: '11px',
                  color: isDarkMode ? '#9ca3af' : '#6b7280',
                  fontStyle: 'italic',
                }}>
                  Export en cours...
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Avertissement si pas de contenu */}
      {!hasContent && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px',
          backgroundColor: isDarkMode ? '#451a03' : '#fffbeb',
          border: `1px solid ${isDarkMode ? '#78350f' : '#fed7aa'}`,
          borderRadius: '6px',
          fontSize: '12px',
          color: isDarkMode ? '#fbbf24' : '#92400e',
        }}>
          <DocumentIcon className="w-4 h-4 flex-shrink-0" />
          <span>
            Ajoutez du contenu Markdown dans l'éditeur pour activer l'export.
          </span>
        </div>
      )}
    </div>
  );
};

export default ExportPanel;