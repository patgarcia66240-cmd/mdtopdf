import React from 'react';

const PDFOptionsPanel = ({ options, onChange, isDarkMode }) => {
  const handleChange = (field, value) => {
    onChange({ ...options, [field]: value });
  };

  // Styles dynamiques selon le mode
  const panelStyle = isDarkMode ? {
    backgroundColor: '#2a2a3d',
    border: '1px solid #3b3b52',
    color: '#fff',
  } : {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    color: '#333',
  };

  const inputStyle = isDarkMode ? {
    backgroundColor: '#1a1a2e',
    color: '#fff',
    border: '1px solid #3b3b52',
  } : {
    backgroundColor: '#fff',
    color: '#333',
    border: '1px solid #ccc',
  };

  const selectStyle = isDarkMode ? {
    backgroundColor: '#1a1a2e',
    color: '#fff',
    border: '1px solid #3b3b52',
  } : {
    backgroundColor: '#fff',
    color: '#333',
    border: '1px solid #ccc',
  };

  return (
    <div
      style={{
        ...panelStyle,
        borderRadius: '0 8px 8px 0',
        padding: '15px 20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
      }}
    >
      {/* Format */}
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', color: isDarkMode ? '#9ca3af' : '#6b7280', cursor: 'move', userSelect: 'none' }}>⋮⋮</span>
        <span style={{ fontSize: '18px' }}>📄</span>
        <span>Format :</span>
        <select
          value={options.format}
          onChange={(e) => handleChange('format', e.target.value)}
          style={selectStyle}
        >
          <option value="a4">A4</option>
          <option value="a3">A3</option>
          <option value="a5">A5</option>
        </select>
      </label>

      {/* Orientation */}
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', color: isDarkMode ? '#9ca3af' : '#6b7280', cursor: 'move', userSelect: 'none' }}>⋮⋮</span>
        <span style={{ fontSize: '18px' }}>📐</span>
        <span>Orientation :</span>
        <select
          value={options.orientation}
          onChange={(e) => handleChange('orientation', e.target.value)}
          style={selectStyle}
        >
          <option value="portrait">Portrait</option>
          <option value="landscape">Paysage</option>
        </select>
      </label>

      {/* Marge */}
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', color: isDarkMode ? '#9ca3af' : '#6b7280', cursor: 'move', userSelect: 'none' }}>⋮⋮</span>
        <span style={{ fontSize: '18px' }}>📏</span>
        <span>Marge (mm) :</span>
        <input
          type="number"
          min="0"
          max="30"
          value={options.margin}
          onChange={(e) => handleChange('margin', Number(e.target.value))}
          style={{ ...inputStyle, width: '60px' }}
        />
      </label>

      {/* Échelle */}
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', color: isDarkMode ? '#9ca3af' : '#6b7280', cursor: 'move', userSelect: 'none' }}>⋮⋮</span>
        <span style={{ fontSize: '18px' }}>🔍</span>
        <span>Échelle :</span>
        <input
          type="number"
          step="0.1"
          min="1"
          max="5"
          value={options.scale}
          onChange={(e) => handleChange('scale', Number(e.target.value))}
          style={{ ...inputStyle, width: '60px' }}
        />
      </label>
    </div>
  );
};

export default PDFOptionsPanel;
