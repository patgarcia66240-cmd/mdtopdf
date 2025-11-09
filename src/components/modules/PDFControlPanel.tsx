import React from 'react';
import { Cog6ToothIcon, SwatchIcon, MagnifyingGlassIcon, MinusIcon, PlusIcon, ArrowPathIcon, DocumentTextIcon, PhotoIcon, ArrowsPointingOutIcon, AdjustmentsHorizontalIcon, SparklesIcon, BookOpenIcon, AcademicCapIcon, CircleStackIcon } from '@heroicons/react/24/outline';
import FileNameInput from '../ui/FileNameInput';
import { PDFOptions } from '../../types/app';
import PDFControlPanelSkeleton from './PDFControlPanelSkeleton';

interface PDFControlPanelProps {
  pdfOptions: PDFOptions;
  onOptionsChange: (options: PDFOptions) => void;
  fileName: string;
  onFileNameChange: (name: string) => void;
  onExportPDF: () => void;
  onExportChange?: (format: string) => void;
  previewTheme: string;
  onThemeChange: (theme: string) => void;
  previewZoom: number;
  onZoomChange: (zoom: number) => void;
  isDarkMode: boolean;
  isLoading?: boolean;
  exportFormat?: string;
}

const PDFControlPanel: React.FC<PDFControlPanelProps> = ({
  pdfOptions,
  onOptionsChange,
  fileName,
  onFileNameChange,
  onExportPDF,
  onExportChange,
  previewTheme,
  onThemeChange,
  previewZoom,
  onZoomChange,
  isDarkMode,
  isLoading = false,
  exportFormat = "pdf"
}) => {
  // État pour détecter mobile
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const panelStyle = {
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
    marginBottom: '16px'
  };

  const sectionStyle = {
    display:'flex',
    marginBottom: '16px'
  };

  const selectStyle = {
    width: '100%',
    padding: '8px 12px',
    border: `1px solid ${isDarkMode ? '#475569' : '#d1d5db'}`,
    borderRadius: '6px',
    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
    color: isDarkMode ? '#f1f5f9' : '#1f2937',
    fontSize: '14px'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: `1px solid ${isDarkMode ? '#475569' : '#d1d5db'}`,
    borderRadius: '6px',
    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
    color: isDarkMode ? '#f1f5f9' : '#1f2937',
    fontSize: '14px'
  };

  const themes = [
    {
      key: 'modern',
      label: 'Moderne',
      icon: <SparklesIcon style={{ width: '14px', height: '14px' }} />
    },
    {
      key: 'classic',
      label: 'Classique',
      icon: <BookOpenIcon style={{ width: '14px', height: '14px' }} />
    },
    {
      key: 'academic',
      label: 'Académique',
      icon: <AcademicCapIcon style={{ width: '14px', height: '14px' }} />
    },
    {
      key: 'minimal',
      label: 'Minimal',
      icon: <CircleStackIcon style={{ width: '14px', height: '14px' }} />
    }
  ];

  const updateOption = (key: keyof PDFOptions, value: any) => {
    onOptionsChange({ ...pdfOptions, [key]: value });
  };

  // Afficher le skeleton pendant le chargement
  if (isLoading) {
    return <PDFControlPanelSkeleton isDarkMode={isDarkMode} />;
  }

  return (
    <div style={panelStyle} role="region" aria-labelledby="pdf-options-title">
      <h3 id="pdf-options-title" style={{
        margin: '0 0 20px 0',
        fontSize: '18px',
        fontWeight: '700',
        color: isDarkMode ? '#f1f5f9' : '#1e293b',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Cog6ToothIcon style={{ width: '18px', height: '18px' }} aria-hidden="true" />
        Options PDF
      </h3>

      {/* Nom du fichier */}
      <div style={sectionStyle}>
        <FileNameInput
          value={fileName}
          onChange={onFileNameChange}
          placeholder="document"
          isDarkMode={isDarkMode}
          buttonText="Exporter"
          onButtonClick={onExportPDF}
          onFormatChange={onExportChange}
          defaultFormat={exportFormat}
          showIcon={true}
        />
      </div>

      {/* Options de format et mise en page */}
      <div style={sectionStyle}>
        <div style={{
          display: isMobile ? 'flex' : 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '12px' : '12px',
          alignItems: isMobile ? 'stretch' : 'center',
          padding: '6px 10px',
          border: `1px solid ${isDarkMode ? '#475569' : '#d1d5db'}`,
          borderRadius: '8px',
          backgroundColor: isDarkMode ? '#0f172a' : '#ffffff'
        }}>
          {/* Ligne 1 sur mobile, première partie sur desktop */}
          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            justifyContent: isMobile ? 'space-between' : 'flex-start'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              minWidth: isMobile ? 'auto' : '100px'
            }}>
              <DocumentTextIcon style={{
                width: '14px',
                height: '14px',
                color: isDarkMode ? '#94a3b8' : '#64748b'
              }} />
              <label htmlFor="format-select" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
                Format du papier
              </label>
              <select
                id="format-select"
                value={pdfOptions.format}
                onChange={(e) => updateOption('format', e.target.value)}
                aria-label="Format du papier PDF"
                style={{
                  ...selectStyle,
                  padding: '2px 6px',
                  fontSize: '11px',
                  border: '1px solid ' + (isDarkMode ? '#334155' : '#e2e8f0'),
                  backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
                  width: '50px',
                  height: '24px',
                  borderRadius: '4px'
                }}
              >
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
                <option value="legal">Legal</option>
              </select>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              minWidth: isMobile ? 'auto' : '110px'
            }}>
              <PhotoIcon style={{
                width: '14px',
                height: '14px',
                color: isDarkMode ? '#94a3b8' : '#64748b'
              }} />
              <label htmlFor="orientation-select" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
                Orientation du papier
              </label>
              <select
                id="orientation-select"
                value={pdfOptions.orientation}
                onChange={(e) => updateOption('orientation', e.target.value)}
                aria-label="Orientation du papier PDF"
                style={{
                  ...selectStyle,
                  padding: '2px 6px',
                  fontSize: '11px',
                  border: '1px solid ' + (isDarkMode ? '#334155' : '#e2e8f0'),
                  backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
                  width: '70px',
                  height: '24px',
                  borderRadius: '4px'
                }}
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Paysage</option>
              </select>
            </div>
          </div>

          {/* Ligne 2 sur mobile, deuxième partie sur desktop */}
          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            justifyContent: isMobile ? 'space-between' : 'flex-start'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              minWidth: isMobile ? 'auto' : '80px'
            }}>
              <ArrowsPointingOutIcon style={{
                width: '14px',
                height: '14px',
                color: isDarkMode ? '#94a3b8' : '#64748b'
              }} />
              <label htmlFor="margin-input" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
                Marges du document en millimètres
              </label>
              <input
                id="margin-input"
                type="number"
                value={pdfOptions.margins.top}
                onChange={(e) => updateOption('margins', {
                  ...pdfOptions.margins,
                  top: parseInt(e.target.value) || pdfOptions.margins.top,
                  right: parseInt(e.target.value) || pdfOptions.margins.right,
                  bottom: parseInt(e.target.value) || pdfOptions.margins.bottom,
                  left: parseInt(e.target.value) || pdfOptions.margins.left
                })}
                min="5"
                max="50"
                placeholder="Marge"
                aria-label="Marges du document PDF en millimètres"
                style={{
                  ...inputStyle,
                  padding: '2px 6px',
                  fontSize: '11px',
                  border: '1px solid ' + (isDarkMode ? '#334155' : '#e2e8f0'),
                  backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
                  width: '40px',
                  height: '24px',
                  borderRadius: '4px'
                }}
              />
              <span style={{
                fontSize: '10px',
                color: isDarkMode ? '#64748b' : '#94a3b8'
              }}>
                mm
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              minWidth: isMobile ? 'auto' : '75px'
            }}>
              <AdjustmentsHorizontalIcon style={{
                width: '14px',
                height: '14px',
                color: isDarkMode ? '#94a3b8' : '#64748b'
              }} />
              <label htmlFor="font-size-input" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
                Taille de police en points
              </label>
              <input
                id="font-size-input"
                type="number"
                value={pdfOptions.fontSize}
                onChange={(e) => updateOption('fontSize', parseInt(e.target.value))}
                min="8"
                max="24"
                placeholder="Police"
                aria-label="Taille de police du document PDF en points"
                style={{
                  ...inputStyle,
                  padding: '2px 6px',
                  fontSize: '11px',
                  border: '1px solid ' + (isDarkMode ? '#334155' : '#e2e8f0'),
                  backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
                  width: '35px',
                  height: '24px',
                  borderRadius: '4px'
                }}
              />
              <span style={{
                fontSize: '10px',
                color: isDarkMode ? '#64748b' : '#94a3b8'
              }}>
                pt
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Thème de l'aperçu */}
      <div style={sectionStyle}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginRight: isMobile ? '0' : '8px',
          marginBottom: isMobile ? '8px' : '0'
        }}>
          <SwatchIcon style={{
            width: '14px',
            height: '14px',
            color: isDarkMode ? '#94a3b8' : '#64748b',
            flexShrink: 0,
            marginRight: '2px'
          }} />
          <span style={{
            fontSize: '13px',
            fontWeight: '600',
            color: isDarkMode ? '#94a3b8' : '#64748b'
          }}>
            Thème de l'aperçu
          </span>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '8px',
          width: '100%'
        }}>
          {themes.map((theme) => (
            <button
              key={theme.key}
              onClick={() => onThemeChange(theme.key)}
              aria-pressed={previewTheme === theme.key}
              aria-label={`Sélectionner le thème ${theme.label} pour l'aperçu`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                flex: isMobile ? 'none' : 1,
                padding: '8px 12px',
                border: '1px solid ' + (previewTheme === theme.key
                  ? '#6b7280'
                  : (isDarkMode ? '#475569' : '#d1d5db')),
                borderRadius: '8px',
                background: previewTheme === theme.key
                  ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
                  : (isDarkMode ? '#0f172a' : '#ffffff'),
                color: previewTheme === theme.key
                  ? '#ffffff'
                  : (isDarkMode ? '#f1f5f9' : '#1f2937'),
                fontSize: '11px',
                fontWeight: previewTheme === theme.key ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                justifyContent: 'center',
                width: isMobile ? '100%' : 'auto'
              }}
            >
              <span style={{
                color: previewTheme === theme.key
                  ? '#ffffff'
                  : (isDarkMode ? '#94a3b8' : '#64748b')
              }} aria-hidden="true">
                {theme.icon}
              </span>
              {theme.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contrôle de zoom */}
      <div style={sectionStyle}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            minWidth: '80px'
          }}>
            <MagnifyingGlassIcon style={{ width: '14px', height: '14px', marginRight: '6px', verticalAlign: 'text-bottom' }} />
            <span style={{ fontSize: '13px', fontWeight: '600', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
              Zoom
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flex: 1
          }}>
            <button
              onClick={() => onZoomChange(Math.max(50, previewZoom - 10))}
              aria-label="Diminuer le zoom de l'aperçu"
              style={{
                padding: '4px 6px',
                border: '1px solid ' + (isDarkMode ? '#475569' : '#d1d5db'),
                borderRadius: '4px',
                backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                color: isDarkMode ? '#f1f5f9' : '#1f2937',
                cursor: 'pointer'
              }}
            >
              <MinusIcon style={{ width: '14px', height: '14px' }} aria-hidden="true" />
            </button>
            <input
              type="range"
              min="50"
              max="150"
              value={previewZoom}
              onChange={(e) => onZoomChange(parseInt(e.target.value))}
              aria-label={`Zoom de l'aperçu: ${previewZoom} pour cent`}
              aria-valuemin={50}
              aria-valuemax={150}
              aria-valuenow={previewZoom}
              aria-valuetext={`${previewZoom}%`}
              style={{
                flex: 1,
                height: '3px',
                borderRadius: '2px',
                background: '#6b7280',
                outline: 'none',
                cursor: 'pointer',
                opacity: 0.8,
                transition: 'all 0.2s ease',
                WebkitAppearance: 'none',
                appearance: 'none',
                borderWidth: '0',
                borderColor: 'transparent',
                color: '#6b7280',
                accentColor: '#6b7280'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'scaleY(1.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.8';
                e.currentTarget.style.transform = 'scaleY(1)';
              }}
            />
            <button
              onClick={() => onZoomChange(Math.min(150, previewZoom + 10))}
              aria-label="Augmenter le zoom de l'aperçu"
              style={{
                padding: '4px 6px',
                border: '1px solid ' + (isDarkMode ? '#475569' : '#d1d5db'),
                borderRadius: '4px',
                backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                color: isDarkMode ? '#f1f5f9' : '#1f2937',
                cursor: 'pointer'
              }}
            >
              <PlusIcon style={{ width: '14px', height: '14px' }} aria-hidden="true" />
            </button>
            <button
              onClick={() => onZoomChange(100)}
              aria-label="Réinitialiser le zoom à 100%"
              style={{
                padding: '4px 8px',
                border: '1px solid ' + (isDarkMode ? '#475569' : '#d1d5db'),
                borderRadius: '6px',
                background: isDarkMode ? '#1e293b' : '#f1f5f9',
                color: isDarkMode ? '#f1f5f9' : '#1f2937',
                fontSize: '10px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <ArrowPathIcon style={{ width: '12px', height: '12px' }} aria-hidden="true" />
            </button>
          </div>
          <div style={{
            fontSize: '12px',
            color: isDarkMode ? '#64748b' : '#6b7280',
            minWidth: '40px',
            textAlign: 'center'
          }}>
            {previewZoom}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFControlPanel;
