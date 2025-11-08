import React, { useState } from 'react';
import {
  DocumentArrowDownIcon,
  Cog6ToothIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  DocumentIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useAdvancedExport } from '../../hooks/useAdvancedExport';
import { ExportOptions } from '../../services/AdvancedExportService';

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
    
  } = useAdvancedExport();

  const [selectedFormats, setSelectedFormats] = useState<string[]>(['pdf']);
  const [filename, setFilename] = useState('document');
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [showOptions, setShowOptions] = useState(false);
  const [hoveredFormat, setHoveredFormat] = useState<string | null>(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [metadata, setMetadata] = useState({
    title: '',
    author: '',
    subject: '',
    keywords: ''
  });

  const formats = [
    {
      id: 'pdf',
      name: 'PDF',
      icon: DocumentIcon,
      description: 'Format PDF universel',
      color: '#dc2626'
    },
    {
      id: 'docx',
      name: 'Word',
      icon: DocumentTextIcon,
      description: 'Document Microsoft Word',
      color: '#2563eb'
    },
    {
      id: 'html',
      name: 'HTML',
      icon: CodeBracketIcon,
      description: 'Page web stylisée',
      color: '#ea580c'
    },
    {
      id: 'png',
      name: 'PNG',
      icon: PhotoIcon,
      description: 'Image haute qualité',
      color: '#16a34a'
    },
    {
      id: 'jpg',
      name: 'JPG',
      icon: PhotoIcon,
      description: 'Image compressée',
      color: '#ca8a04'
    },
    {
      id: 'md',
      name: 'Markdown',
      icon: ChatBubbleLeftRightIcon,
      description: 'Texte brut Markdown',
      color: '#9333ea'
    }
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

  const overlayStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    zIndex: 1999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'fadeIn 0.3s ease-out'
  };

  const containerStyle = {
    position: 'relative' as const,
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
    borderRadius: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
    zIndex: 2000,
    width: '90%',
    maxWidth: '640px',
    maxHeight: '85vh',
    overflow: 'auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    transform: 'scale(1)',
    animation: 'slideIn 0.3s ease-out',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
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

  const formatCardStyle = (selected: boolean, isHovered: boolean = false) => ({
    padding: '20px',
    border: `2px solid ${selected ? (isDarkMode ? '#6b7280' : '#4b5563') : (isDarkMode ? '#475569' : '#e2e8f0')}`,
    borderRadius: '16px',
    backgroundColor: selected
      ? (isDarkMode ? '#374151' : '#f1f5f9')
      : isHovered
        ? (isDarkMode ? '#4b5563' : '#f9fafb')
        : (isDarkMode ? '#334155' : '#f8fafc'),
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textAlign: 'center' as const,
    transform: selected ? 'scale(1.02)' : (isHovered ? 'scale(1.01)' : 'scale(1)'),
    boxShadow: selected
      ? '0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      : isHovered
        ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        : 'none'
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
    background: isExporting
      ? (isDarkMode
        ? 'linear-gradient(135deg, #374151 0%, #1f2937 50%, #111827 100%)'
        : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 50%, #4b5563 100%)'
      )
      : (isDarkMode
        ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 40%, #374151 70%, #1f2937 100%)'
        : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 25%, #4b5563 55%, #374151 85%, #1f2937 100%)'
      ),
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: isExporting ? 'not-allowed' : 'pointer',
    opacity: isExporting ? 0.8 : 1,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    boxShadow: isExporting
      ? 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)'
      : (isDarkMode
        ? '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
        : '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)'
      ),
    transform: 'translateY(0)',
    position: 'relative' as const,
    overflow: 'hidden',
    textShadow: isExporting ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.3)'
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    background: isExporting
      ? buttonStyle.background
      : (isDarkMode
        ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 30%, #4b5563 60%, #374151 85%, #1f2937 100%)'
        : 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 20%, #6b7280 50%, #4b5563 75%, #374151 95%, #1f2937 100%)'
      ),
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: isDarkMode
      ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)'
      : '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)'
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
    <div style={overlayStyle} onClick={onClose}>
      <div style={containerStyle} onClick={(e) => e.stopPropagation()}>
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
            {formats.map(format => {
                const Icon = format.icon;
                const isSelected = selectedFormats.includes(format.id);
                const isHovered = hoveredFormat === format.id;

                return (
                  <div
                    key={format.id}
                    style={formatCardStyle(isSelected, isHovered)}
                    onClick={() => handleFormatToggle(format.id)}
                    onMouseEnter={() => setHoveredFormat(format.id)}
                    onMouseLeave={() => setHoveredFormat(null)}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginBottom: '12px',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        backgroundColor: isSelected
                          ? (isDarkMode ? '#6b7280' : '#e5e7eb')
                          : (isDarkMode ? '#374151' : '#f1f5f9'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease'
                      }}>
                        <Icon style={{
                          width: '24px',
                          height: '24px',
                          color: isSelected
                            ? '#6b7280'
                            : (isDarkMode ? '#9ca3af' : '#6b7280'),
                          transition: 'all 0.3s ease'
                        }} />
                      </div>
                      {isSelected && (
                        <CheckIcon
                          style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-4px',
                            width: '16px',
                            height: '16px',
                            color: '#4b7280'
                          }}
                        />
                      )}
                    </div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: isDarkMode ? '#f1f5f9' : '#1e293b',
                      marginBottom: '4px',
                      transition: 'all 0.3s ease'
                    }}>
                      {format.name}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                      lineHeight: '1.4',
                      transition: 'all 0.3s ease'
                    }}>
                      {format.description}
                    </div>
                  </div>
                );
              })}
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
              color: isDarkMode ? '#3b82f6' : '#777777',
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
          style={isButtonHovered && !isExporting && selectedFormats.length > 0 ? buttonHoverStyle : buttonStyle}
          onClick={handleExport}
          disabled={isExporting || selectedFormats.length === 0}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          {isExporting ? (
            <>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTop: '2px solid #ffffff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Export en cours...
            </>
          ) : (
            <>
              <DocumentArrowDownIcon style={{
                width: '20px',
                height: '20px',
                color: '#ffffff'
              }} />
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
                    <CheckIcon style={{ width: '20px', height: '20px', color: '#10b981' }} />
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

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: scale(0.95) translateY(-10px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          @keyframes scaleIn {
            from {
              transform: scale(0);
            }
            to {
              transform: scale(1);
            }
          }
        `}
      </style>
      </div>
    </div>
  );
};

export default AdvancedExportPanel;