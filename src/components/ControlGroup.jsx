import React from 'react';

const ControlGroup = ({
  id,
  title,
  items,
  isDragged = false,
  isDragOver = false,
  isDarkMode = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  style = {},
  children
}) => {
  // Style pour les groupes de contrôles inspiré de MarkdownEditor
  const getControlGroupStyle = (isDragged, isDragOver) => {
    const baseStyle = {
      display: 'flex',
      gap: '4px',
      backgroundColor: isDarkMode ? '#1f2937' : '#f1f5f9',
      padding: '6px',
      borderRadius: '8px',
      cursor: 'move',
      transition: 'all 0.2s ease',
      userSelect: 'none',
      flexWrap: 'wrap',
      alignItems: 'center',
      border: isDragged ?
        (isDarkMode ? '2px dashed #10b981' : '2px dashed #059669') :
        (isDragOver ?
          (isDarkMode ? '2px dashed #3b82f6' : '2px dashed #2563eb') :
          'none'),
      ...style
    };

    if (isDragged) {
      return {
        ...baseStyle,
        opacity: 0.5,
        transform: 'scale(0.98)',
        zIndex: 1000,
      };
    }

    if (isDragOver) {
      return {
        ...baseStyle,
        transform: 'translateY(2px)',
        border: isDarkMode ? '2px dashed #3b82f6' : '2px dashed #2563eb',
      };
    }

    return baseStyle;
  };

  // Style pour les boutons inspiré de MarkdownEditor
  const buttonStyle = (isActive, group = 'default') => ({
    padding: '8px 14px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: isActive
      ? (group === 'format'
          ? (isDarkMode ? '#10b981' : '#059669')
          : (isDarkMode ? '#3b82f6' : '#2563eb'))
      : 'transparent',
    color: isActive
      ? 'white'
      : (isDarkMode ? '#9ca3af' : '#64748b'),
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    position: 'relative',
    '&:hover': {
      backgroundColor: isActive
        ? undefined
        : (isDarkMode ? '#374151' : '#e2e8f0'),
      transform: 'translateY(-1px)',
    }
  });

  // Style pour le groupe de boutons
  const buttonGroupStyle = {
    display: 'flex',
    gap: '2px',
    backgroundColor: 'transparent',
    padding: '2px',
    borderRadius: '6px',
  };

  return (
    <div
      key={id}
      style={getControlGroupStyle(isDragged, isDragOver)}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '12px' }}>
        <span style={{ fontSize: '12px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>⋮⋮</span>
        <span style={{ fontSize: '12px', fontWeight: '500', color: isDarkMode ? '#e5e7eb' : '#374151' }}>
          {title}
        </span>
      </div>

      {children || (
        <div style={buttonGroupStyle}>
          {items?.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              style={buttonStyle(item.isActive, item.group)}
              title={item.title}
              disabled={item.disabled}
            >
              <span style={{ fontSize: '14px' }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.children}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

ControlGroup.Item = ({ icon, label, children, isActive = false, isDarkMode = false, onClick }) => {
  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 10px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: isActive
      ? (isDarkMode ? '#3b82f6' : '#2563eb')
      : 'transparent',
    color: isActive
      ? 'white'
      : (isDarkMode ? '#9ca3af' : '#64748b'),
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: isActive
        ? undefined
        : (isDarkMode ? '#374151' : '#e2e8f0'),
    }
  };

  return (
    <div style={itemStyle} onClick={onClick}>
      <span style={{ fontSize: '14px' }}>{icon}</span>
      <span>{label}</span>
      {children}
    </div>
  );
};

export default ControlGroup;