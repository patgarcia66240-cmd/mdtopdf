import React from 'react';
import {
  DocumentIcon,
  AdjustmentsHorizontalIcon,
  ArrowsRightLeftIcon,
  DocumentTextIcon,
  HashtagIcon,
  MagnifyingGlassPlusIcon
} from '@heroicons/react/24/outline';

const PDFHeaderFooterPanel = ({ options, onChange, isDarkMode }) => {
  const handleChange = (field, value) => {
    onChange({ ...options, [field]: value });
  };

  // Styles dynamiques selon le mode
  const containerStyle = {
    marginBottom: '20px',
    padding: '16px 20px',
    background: isDarkMode
      ? 'linear-gradient(135deg, #2a2a3d 0%, #1f2937 100%)'
      : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: '12px',
    border: isDarkMode ? '1px solid #374151' : '1px solid #e2e8f0',
    boxShadow: isDarkMode
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  };

  const groupStyle = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '12px',
    padding: '8px 12px',
    backgroundColor: isDarkMode ? '#374151' : '#f8fafc',
    borderRadius: '8px',
    flexWrap: 'wrap',
  };

  const controlStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const iconStyle = {
    width: '16px',
    height: '16px',
    color: isDarkMode ? '#60a5fa' : '#2563eb',
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: '500',
    color: isDarkMode ? '#e5e7eb' : '#374151',
    minWidth: '60px',
  };

  const inputStyle = {
    padding: '4px 8px',
    borderRadius: '4px',
    border: '1px solid',
    backgroundColor: isDarkMode ? '#1a1a2e' : '#fff',
    color: isDarkMode ? '#fff' : '#333',
    borderColor: isDarkMode ? '#3b3b52' : '#ccc',
    fontSize: '13px',
    minWidth: '80px',
  };

  const selectStyle = {
    padding: '4px 8px',
    borderRadius: '4px',
    border: '1px solid',
    backgroundColor: isDarkMode ? '#1a1a2e' : '#fff',
    color: isDarkMode ? '#fff' : '#333',
    borderColor: isDarkMode ? '#3b3b52' : '#ccc',
    fontSize: '13px',
    minWidth: '80px',
  };

  return (
    <div style={containerStyle}>
      {/* Tous les contrôles sur une seule ligne */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }}>

        {/* Format */}
        <div style={controlStyle}>
          <DocumentIcon style={iconStyle} />
          <span style={labelStyle}>Format</span>
          <select
            value={options.format || 'a4'}
            onChange={(e) => handleChange('format', e.target.value)}
            style={selectStyle}
          >
            <option value="a4">A4</option>
            <option value="a3">A3</option>
            <option value="a5">A5</option>
          </select>
        </div>

        {/* Orientation */}
        <div style={controlStyle}>
          <ArrowsRightLeftIcon style={iconStyle} />
          <span style={labelStyle}>Orientation</span>
          <select
            value={options.orientation || 'portrait'}
            onChange={(e) => handleChange('orientation', e.target.value)}
            style={selectStyle}
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Paysage</option>
          </select>
        </div>

        {/* Marge */}
        <div style={controlStyle}>
          <AdjustmentsHorizontalIcon style={iconStyle} />
          <span style={labelStyle}>Marge</span>
          <input
            type="number"
            min="0"
            max="30"
            value={options.margin || 20}
            onChange={(e) => handleChange('margin', Number(e.target.value))}
            style={{...inputStyle, width: '60px'}}
          />
          <span style={{ fontSize: '12px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>mm</span>
        </div>

        {/* Échelle */}
        <div style={controlStyle}>
          <MagnifyingGlassPlusIcon style={iconStyle} />
          <span style={labelStyle}>Échelle</span>
          <input
            type="number"
            step="0.1"
            min="1"
            max="5"
            value={options.scale || 1}
            onChange={(e) => handleChange('scale', Number(e.target.value))}
            style={{...inputStyle, width: '60px'}}
          />
        </div>

        {/* En-tête */}
        <div style={controlStyle}>
          <DocumentTextIcon style={iconStyle} />
          <span style={labelStyle}>En-tête</span>
          <input
            type="text"
            value={options.header || ''}
            onChange={(e) => handleChange('header', e.target.value)}
            placeholder="Ex: Documentation"
            style={{...inputStyle, minWidth: '120px'}}
          />
        </div>

        {/* Pied de page */}
        <div style={controlStyle}>
          <DocumentIcon style={iconStyle} />
          <span style={labelStyle}>Pied</span>
          <input
            type="text"
            value={options.footer || ''}
            onChange={(e) => handleChange('footer', e.target.value)}
            placeholder="Ex: © 2025"
            style={{...inputStyle, minWidth: '100px'}}
          />
        </div>

        {/* Numéros de page */}
        <div style={controlStyle}>
          <HashtagIcon style={iconStyle} />
          <span style={labelStyle}>Pages</span>
          <input
            type="checkbox"
            checked={options.showPageNumbers || false}
            onChange={(e) => handleChange('showPageNumbers', e.target.checked)}
            style={{ marginRight: '4px' }}
          />
          <span style={{ fontSize: '13px', color: isDarkMode ? '#e5e7eb' : '#374151' }}>
            Numéros
          </span>
        </div>

      </div>
    </div>
  );
};

export default PDFHeaderFooterPanel;