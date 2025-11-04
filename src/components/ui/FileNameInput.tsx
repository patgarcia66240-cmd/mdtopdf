import React, { useState } from 'react';
import { DocumentArrowDownIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface FileNameInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isDarkMode?: boolean;
  label?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  showIcon?: boolean;
  onFormatChange?: (format: string) => void;
  defaultFormat?: string;
}

const FileNameInput: React.FC<FileNameInputProps> = ({
  value,
  onChange,
  placeholder = "document",
  isDarkMode = false,
  label = "Nom du fichier d'export",
  buttonText = "Exporter",
  onButtonClick,
  showIcon = true,
  onFormatChange,
  defaultFormat = "pdf"
}) => {
  const [selectedFormat, setSelectedFormat] = useState(defaultFormat);

  // Synchroniser le format local avec les changements externes
  React.useEffect(() => {
    setSelectedFormat(defaultFormat);
  }, [defaultFormat]);
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);

  const formats = [
    { value: 'pdf', label: 'PDF' },
    { value: 'md', label: 'MD' },
    { value: 'html', label: 'HTML' }
  ];
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
    gap: '6px',
    alignItems: 'center',
    marginBottom: '12px'
  };

  const formatButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 16px',
    backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    color: isDarkMode ? '#f9fafb' : '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap' as const,
    minWidth: '70px',
    justifyContent: 'center'
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute' as const,
    top: '100%',
    right: '0',
    marginTop: '4px',
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 50,
    minWidth: '120px',
    overflow: 'hidden'
  };

  const dropdownItemStyle = {
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '500',
    color: isDarkMode ? '#f9fafb' : '#111827',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    backgroundColor: 'transparent',
    width: '100%',
    textAlign: 'left' as const,
    display: 'block'
  };

  const inputStyle = {
    flex: 1,
    padding: '4px 16px',
    border: `2px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
    borderRadius: '8px',
    fontSize: '15px',
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    color: isDarkMode ? '#f9fafb' : '#111827',
    outline: 'none',
    transition: 'all 0.2s ease'
  };

  const buttonStyle = {
    padding: '6px 24px',
    background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
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
    e.currentTarget.style.background = 'linear-gradient(135deg, #4b5563 0%, #374151 100%)';
    e.currentTarget.style.transform = 'translateY(-1px)';
  };

  const handleButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    e.currentTarget.style.transform = 'translateY(0)';
  };

  const handleFormatClick = () => {
    setShowFormatDropdown(!showFormatDropdown);
  };

  const handleFormatSelect = (format: string) => {
    setSelectedFormat(format);
    setShowFormatDropdown(false);
    if (onFormatChange) {
      onFormatChange(format);
    }
  };

  const handleFormatHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = isDarkMode ? '#4b5563' : '#e5e7eb';
  };

  const handleFormatLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#f3f4f6';
  };

  const handleDropdownItemHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#f3f4f6';
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const dropdownElement = document.getElementById('format-dropdown');

      // Vérifier si le clic est en dehors du dropdown
      if (showFormatDropdown && dropdownElement && !dropdownElement.contains(target)) {
        setShowFormatDropdown(false);
      }
    };

    if (showFormatDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showFormatDropdown]);

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

        <div style={{ position: 'relative' }} id="format-dropdown">
          <button
            onClick={handleFormatClick}
            onMouseEnter={handleFormatHover}
            onMouseLeave={handleFormatLeave}
            style={formatButtonStyle}
            type="button"
          >
            {selectedFormat.toUpperCase()}
            <ChevronDownIcon style={{ width: '14px', height: '14px' }} />
          </button>

          {showFormatDropdown && (
            <div style={dropdownStyle}>
              {formats.map((format) => (
                <button
                  key={format.value}
                  onClick={() => handleFormatSelect(format.value)}
                  onMouseEnter={handleDropdownItemHover}
                  style={dropdownItemStyle}
                  type="button"
                >
                  {format.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleButtonClick}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
          style={buttonStyle}
          type="button"
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
