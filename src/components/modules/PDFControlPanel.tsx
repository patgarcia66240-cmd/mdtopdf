import React from 'react';
import { Cog6ToothIcon, SwatchIcon, MagnifyingGlassIcon, MinusIcon, PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import FileNameInput from '../ui/FileNameInput';
import { PDFOptions } from '../../types/app';

interface PDFControlPanelProps {
  pdfOptions: PDFOptions;
  onOptionsChange: (options: PDFOptions) => void;
  fileName: string;
  onFileNameChange: (name: string) => void;
  onExportPDF: () => void;
  previewTheme: string;
  onThemeChange: (theme: string) => void;
  previewZoom: number;
  onZoomChange: (zoom: number) => void;
  isDarkMode: boolean;
}

const PDFControlPanel: React.FC<PDFControlPanelProps> = ({
  pdfOptions,
  onOptionsChange,
  fileName,
  onFileNameChange,
  onExportPDF,
  previewTheme,
  onThemeChange,
  previewZoom,
  onZoomChange,
  isDarkMode
}) => {
  const panelStyle = {
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
    marginBottom: '16px'
  };

  const sectionStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: isDarkMode ? '#94a3b8' : '#64748b'
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
    { key: 'modern', label: 'Moderne', icon: '✨' },
    { key: 'classic', label: 'Classique', icon: '📜' },
    { key: 'academic', label: 'Académique', icon: '🎓' },
    { key: 'minimal', label: 'Minimal', icon: '⚪' }
  ];

  const updateOption = (key: keyof PDFOptions, value: any) => {
    onOptionsChange({ ...pdfOptions, [key]: value });
  };

  return (
    <div style={panelStyle}>
      <h3 style={{
        margin: '0 0 20px 0',
        fontSize: '18px',
        fontWeight: '700',
        color: isDarkMode ? '#f1f5f9' : '#1e293b',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Cog6ToothIcon style={{ width: '18px', height: '18px' }} />
        Options PDF
      </h3>

      {/* Nom du fichier */}
      <div style={sectionStyle}>
        <FileNameInput
          value={fileName}
          onChange={onFileNameChange}
          placeholder="document"
          isDarkMode={isDarkMode}
          buttonText="Exporter en PDF"
          onButtonClick={onExportPDF}
          showIcon={true}
        />
      </div>

      {/* Options de format */}
      <div style={sectionStyle}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Format</label>
            <select
              value={pdfOptions.format}
              onChange={(e) => updateOption('format', e.target.value)}
              style={selectStyle}
            >
              <option value="a4">A4</option>
              <option value="letter">Letter</option>
              <option value="legal">Legal</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Orientation</label>
            <select
              value={pdfOptions.orientation}
              onChange={(e) => updateOption('orientation', e.target.value)}
              style={selectStyle}
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Paysage</option>
            </select>
          </div>
        </div>
      </div>

      {/* Options de mise en page */}
      <div style={sectionStyle}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Marges (mm)</label>
            <input
              type="number"
              value={pdfOptions.margins.top}
              onChange={(e) => updateOption('margins', {
                ...pdfOptions.margins,
                top: parseInt(e.target.value),
                right: parseInt(e.target.value),
                bottom: parseInt(e.target.value),
                left: parseInt(e.target.value)
              })}
              min="5"
              max="50"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Taille police</label>
            <input
              type="number"
              value={pdfOptions.fontSize}
              onChange={(e) => updateOption('fontSize', parseInt(e.target.value))}
              min="8"
              max="24"
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* Thème de l'aperçu */}
      <div style={sectionStyle}>
        <label style={labelStyle}>
          <SwatchIcon style={{ width: '14px', height: '14px', marginRight: '6px', verticalAlign: 'middle' }} />
          Thème de l'aperçu
        </label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px'
        }}>
          {themes.map((theme) => (
            <button
              key={theme.key}
              onClick={() => onThemeChange(theme.key)}
              style={{
                padding: '8px 12px',
                border: '1px solid ' + (previewTheme === theme.key
                  ? (isDarkMode ? '#3b82f6' : '#2563eb')
                  : (isDarkMode ? '#475569' : '#d1d5db')),
                borderRadius: '8px',
                background: previewTheme === theme.key
                  ? (isDarkMode ? '#3b82f6' : '#2563eb')
                  : (isDarkMode ? '#0f172a' : '#ffffff'),
                color: previewTheme === theme.key
                  ? '#ffffff'
                  : (isDarkMode ? '#f1f5f9' : '#1f2937'),
                fontSize: '11px',
                fontWeight: previewTheme === theme.key ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {theme.icon} {theme.label}
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
              style={{
                padding: '4px 6px',
                border: '1px solid ' + (isDarkMode ? '#475569' : '#d1d5db'),
                borderRadius: '4px',
                backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                color: isDarkMode ? '#f1f5f9' : '#1f2937',
                cursor: 'pointer'
              }}
            >
              <MinusIcon style={{ width: '14px', height: '14px' }} />
            </button>
            <input
              type="range"
              min="50"
              max="150"
              value={previewZoom}
              onChange={(e) => onZoomChange(parseInt(e.target.value))}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '2px',
                background: isDarkMode ? '#475569' : '#d1d5db',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
            <button
              onClick={() => onZoomChange(Math.min(150, previewZoom + 10))}
              style={{
                padding: '4px 6px',
                border: '1px solid ' + (isDarkMode ? '#475569' : '#d1d5db'),
                borderRadius: '4px',
                backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                color: isDarkMode ? '#f1f5f9' : '#1f2937',
                cursor: 'pointer'
              }}
            >
              <PlusIcon style={{ width: '14px', height: '14px' }} />
            </button>
            <button
              onClick={() => onZoomChange(100)}
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
              <ArrowPathIcon style={{ width: '12px', height: '12px' }} />
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
