import React, { useState } from 'react';
import { DocumentArrowDownIcon, Cog6ToothIcon, XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useAdvancedExport } from '../../hooks/useAdvancedExport';
import { ExportOptions, ExportProgress } from '../../services/AdvancedExportService';

interface AdvancedExportPanelProps {
  markdown: string;
  elementRef: React.RefObject<HTMLElement>;
  isDarkMode: boolean;
  onClose?: () => void;
}

const AdvancedExportPanel: React.FC<AdvancedExportPanelProps> = ({
  markdown,
  elementRef,
  isDarkMode,
  onClose
}) => {
  const {
    exportToMultipleFormats,
    activeExports,
    cancelExport,
    isExporting,
    exportProgress
  } = useAdvancedExport();

  const [selectedFormats, setSelectedFormats] = useState<string[]>(['pdf']);
  const [filename, setFilename] = useState('document');
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [showOptions, setShowOptions] = useState(false);
  const [metadata, setMetadata] = useState({
    title: '',
    author: '',
    subject: '',
    keywords: ''
  });

  const formats = [
    { id: 'pdf', name: 'PDF', icon: '📄', description: 'Format PDF universel' },
    { id: 'docx', name: 'Word', icon: '📝', description: 'Document Microsoft Word' },
    { id: 'html', name: 'HTML', icon: '🌐', description: 'Page web stylisée' },
    { id: 'png', name: 'PNG', icon: '🖼️', description: 'Image haute qualité' },
    { id: 'jpg', name: 'JPG', icon: '📷', description: 'Image compressée' },
    { id: 'md', name: 'Markdown', icon: '📃', description: 'Texte brut Markdown' }
  ];

  const qualities = [
    { id: 'low', name: 'Basse', description: 'Fichier plus léger' },
    { id: 'medium', name: 'Moyenne', description: 'Équilibre qualité/poids' },
    { id: 'high', name: 'Haute', description: 'Meilleure qualité' }
  ];

  const handleFormatToggle = (formatId: string) => {
    setSelectedFormats(prev => {
      if (prev.includes(formatId)) {
        return prev.filter(f => f !== formatId);
      }
      return [...prev, formatId];
    });
  };

  const handleExport = async () => {
    if (selectedFormats.length === 0) {
      alert('Veuillez sélectionner au moins un format d\'export');
      return;
    }

    if (!elementRef.current && selectedFormats.some(f => ['png', 'jpg'].includes(f))) {
      alert('L\'export d\'images nécessite un aperçu disponible');
      return;
    }

    try {
      const exportOptions: ExportOptions[] = selectedFormats.map(format => ({
        format: format as ExportOptions['format'],
        quality,
        filename: format === 'pdf' ? filename : `${filename}_${format}`,
        metadata: Object.keys(metadata).some(key => metadata[key as keyof typeof metadata])
          ? metadata
          : {
              title: filename,
              author: metadata.author || undefined,
              subject: metadata.subject || undefined,
              keywords: metadata.keywords || undefined
            },
        pdfOptions: format === 'pdf' ? {
          format: 'a4',
          orientation: 'portrait',
          margins: { top: 20, right: 20, bottom: 20, left: 20 },
          fontSize: 12,
          fontFamily: 'helvetica'
        } : undefined,
        imageOptions: ['png', 'jpg'].includes(format) ? {
          scale: quality === 'high' ? 2 : quality === 'medium' ? 1.5 : 1,
          backgroundColor: '#ffffff'
        } : undefined
      }));

      await exportToMultipleFormats(markdown, elementRef.current, exportOptions);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Une erreur est survenue lors de l\'export. Veuillez réessayer.');
    }
  };

  const containerStyle = {
    position: 'fixed' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
    borderRadius: '16px',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
    zIndex: 2000,
    width: '600px',
    maxHeight: '80vh',
    overflow: 'auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 24px 16px',
    borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    color: isDarkMode ? '#f1f5f9' : '#1e293b',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const contentStyle = {
    padding: '24px'
  };

  const formatGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '24px'
  };

  const formatCardStyle = (selected: boolean) => ({
    padding: '16px',
    border: `2px solid ${selected ? (isDarkMode ? '#3b82f6' : '#2563eb') : (isDarkMode ? '#475569' : '#e2e8f0')}`,
    borderRadius: '12px',
    backgroundColor: selected ? (isDarkMode ? '#1e3a8a' : '#dbeafe') : (isDarkMode ? '#334155' : '#f8fafc'),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center' as const
  });

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: `1px solid ${isDarkMode ? '#475569' : '#d1d5db'}`,
    borderRadius: '8px',
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    color: isDarkMode ? '#f9fafb' : '#111827',
    fontSize: '14px'
  };

  const selectStyle = {
    width: '100%',
    padding: '12px',
    border: `1px solid ${isDarkMode ? '#475569' : '#d1d5db'}`,
    borderRadius: '8px',
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    color: isDarkMode ? '#f9fafb' : '#111827',
    fontSize: '14px'
  };

  const buttonStyle = {
    width: '100%',
    padding: '16px',
    backgroundColor: isDarkMode ? '#3b82f6' : '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: isExporting ? 'not-allowed' : 'pointer',
    opacity: isExporting ? 0.6 : 1,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px'
  };

  const progressItemStyle = (status: string) => ({
    padding: '12px',
    margin: '8px 0',
    borderRadius: '8px',
    backgroundColor: status === 'completed'
      ? (isDarkMode ? '#064e3b' : '#ecfdf5')
      : status === 'error'
      ? (isDarkMode ? '#7f1d1d' : '#fef2f2')
      : (isDarkMode ? '#334155' : '#f8fafc'),
    border: `1px solid ${isDarkMode ? '#475569' : '#e2e8f0'}`
  });

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>
          <DocumentArrowDownIcon style={{ width: '24px', height: '24px' }} />
          Export Avancé
        </h2>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: isDarkMode ? '#94a3b8' : '#64748b'
          }}
        >
          <XMarkIcon style={{ width: '24px', height: '24px' }} />
        </button>
      </div>

      <div style={contentStyle}>
        {/* Nom du fichier */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: isDarkMode ? '#f3f4f6' : '#374151'
          }}>
            Nom du fichier
          </label>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            style={inputStyle}
            placeholder="document"
          />
        </div>

        {/* Sélection des formats */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '12px',
            fontSize: '14px',
            fontWeight: '500',
            color: isDarkMode ? '#f3f4f6' : '#374151'
          }}>
            Formats d'export
          </label>
          <div style={formatGridStyle}>
            {formats.map(format => (
              <div
                key={format.id}
                style={formatCardStyle(selectedFormats.includes(format.id))}
                onClick={() => handleFormatToggle(format.id)}
              >
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>{format.icon}</div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: isDarkMode ? '#f1f5f9' : '#1e293b',
                  marginBottom: '2px'
                }}>
                  {format.name}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: isDarkMode ? '#94a3b8' : '#64748b'
                }}>
                  {format.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Qualité */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: isDarkMode ? '#f3f4f6' : '#374151'
          }}>
            Qualité
          </label>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value as 'low' | 'medium' | 'high')}
            style={selectStyle}
          >
            {qualities.map(q => (
              <option key={q.id} value={q.id}>
                {q.name} - {q.description}
              </option>
            ))}
          </select>
        </div>

        {/* Options avancées */}
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => setShowOptions(!showOptions)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isDarkMode ? '#3b82f6' : '#2563eb',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <Cog6ToothIcon style={{ width: '16px', height: '16px' }} />
            {showOptions ? 'Masquer' : 'Afficher'} les options avancées
          </button>

          {showOptions && (
            <div style={{
              marginTop: '16px',
              padding: '16px',
              backgroundColor: isDarkMode ? '#334155' : '#f8fafc',
              borderRadius: '8px'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: isDarkMode ? '#f3f4f6' : '#374151'
                }}>
                  Titre
                </label>
                <input
                  type="text"
                  value={metadata.title}
                  onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                  style={{ ...inputStyle, fontSize: '12px', padding: '8px' }}
                  placeholder="Titre du document"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: isDarkMode ? '#f3f4f6' : '#374151'
                }}>
                  Auteur
                </label>
                <input
                  type="text"
                  value={metadata.author}
                  onChange={(e) => setMetadata(prev => ({ ...prev, author: e.target.value }))}
                  style={{ ...inputStyle, fontSize: '12px', padding: '8px' }}
                  placeholder="Nom de l'auteur"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: isDarkMode ? '#f3f4f6' : '#374151'
                }}>
                  Sujet
                </label>
                <input
                  type="text"
                  value={metadata.subject}
                  onChange={(e) => setMetadata(prev => ({ ...prev, subject: e.target.value }))}
                  style={{ ...inputStyle, fontSize: '12px', padding: '8px' }}
                  placeholder="Sujet du document"
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: isDarkMode ? '#f3f4f6' : '#374151'
                }}>
                  Mots-clés
                </label>
                <input
                  type="text"
                  value={metadata.keywords}
                  onChange={(e) => setMetadata(prev => ({ ...prev, keywords: e.target.value }))}
                  style={{ ...inputStyle, fontSize: '12px', padding: '8px' }}
                  placeholder="markdown, pdf, export"
                />
              </div>
            </div>
          )}
        </div>

        {/* Bouton d'export */}
        <button
          style={buttonStyle}
          onClick={handleExport}
          disabled={isExporting || selectedFormats.length === 0}
        >
          {isExporting ? (
            <>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid white',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Export en cours...
            </>
          ) : (
            <>
              <DocumentArrowDownIcon style={{ width: '20px', height: '20px' }} />
              Exporter ({selectedFormats.length} format{selectedFormats.length > 1 ? 's' : ''})
            </>
          )}
        </button>

        {/* Progression des exports */}
        {activeExports.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: isDarkMode ? '#f1f5f9' : '#1e293b',
              marginBottom: '16px'
            }}>
              Progression des exports
            </h3>
            {activeExports.map(exp => (
              <div key={exp.id} style={progressItemStyle(exp.status)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {exp.status === 'completed' && (
                    <CheckCircleIcon style={{ width: '20px', height: '20px', color: '#10b981' }} />
                  )}
                  {exp.status === 'error' && (
                    <ExclamationTriangleIcon style={{ width: '20px', height: '20px', color: '#ef4444' }} />
                  )}
                  {exp.status === 'processing' && (
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid #e5e7eb',
                      borderTop: '2px solid #3b82f6',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                  )}

                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: isDarkMode ? '#f1f5f9' : '#1e293b',
                      marginBottom: '4px'
                    }}>
                      {exp.stage}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: isDarkMode ? '#94a3b8' : '#64748b'
                    }}>
                      {exp.progress}% • {exp.estimatedTime ? `${exp.estimatedTime}s restantes` : 'Calcul...'}
                    </div>
                  </div>

                  {exp.status === 'processing' && (
                    <button
                      onClick={() => cancelExport(exp.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      <XMarkIcon style={{ width: '16px', height: '16px' }} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AdvancedExportPanel;