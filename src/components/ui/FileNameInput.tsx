import React from 'react';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

interface FileNameInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isDarkMode?: boolean;
  label?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  showIcon?: boolean;
}

const FileNameInput: React.FC<FileNameInputProps> = ({
  value,
  onChange,
  placeholder = "document",
  isDarkMode = false,
  label = "Nom du fichier d'export",
  buttonText = "Valider",
  onButtonClick,
  showIcon = true
}) => {
  const labelStyle = {
    display: 'block',
    marginBottom: '12px',
    fontSize: '15px',
    fontWeight: '600',
    color: isDarkMode ? '#f1f5f9' : '#1e293b'
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '16px'
  };

  const inputStyle = {
    flex: 1,
    padding: '12px 16px',
    border: `2px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
    borderRadius: '8px',
    fontSize: '15px',
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    color: isDarkMode ? '#f9fafb' : '#111827',
    outline: 'none',
    transition: 'all 0.2s ease'
  };

  const buttonStyle = {
    padding: '12px 24px',
    backgroundColor: isDarkMode ? '#3b82f6' : '#2563eb',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap' as const,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const iconStyle = {
    width: '16px',
    height: '16px'
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = isDarkMode ? '#60a5fa' : '#3b82f6';
    e.target.style.boxShadow = `0 0 0 3px ${isDarkMode ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`;
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = isDarkMode ? '#374151' : '#e5e7eb';
    e.target.style.boxShadow = 'none';
  };

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    }
  };

  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = isDarkMode ? '#60a5fa' : '#1d4ed8';
    e.currentTarget.style.transform = 'translateY(-1px)';
  };

  const handleButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = isDarkMode ? '#3b82f6' : '#2563eb';
    e.currentTarget.style.transform = 'translateY(0)';
  };

  return (
    <div>
      <label style={labelStyle}>
        {label}
      </label>
      <div style={containerStyle}>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          style={inputStyle}
        />
        <button
          onClick={handleButtonClick}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
          style={buttonStyle}
        >
          {showIcon && (
            <DocumentArrowDownIcon style={iconStyle} />
          )}
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default FileNameInput;
