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

  // Classes Tailwind pour le bouton export avec dégradé gris
  const getExportButtonClasses = () => {
    return "px-6 py-1.5 bg-gradient-to-r from-gray-500 to-gray-600 border-0 rounded-lg text-base font-semibold text-white cursor-pointer transition-all duration-200 whitespace-nowrap flex items-center gap-2 hover:from-gray-600 hover:to-gray-700 hover:transform hover:translate-y-[-1px] hover:shadow-lg active:scale-95";
  };

  // Classes pour le champ input
  const getInputClasses = () => {
    return `flex-1 px-4 py-1 border-2 rounded-lg text-base outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
      isDarkMode
        ? 'bg-gray-800 text-gray-100 border-gray-600 focus:ring-blue-400 focus:border-blue-400'
        : 'bg-white text-gray-900 border-gray-300'
    }`;
  };

  // Classes pour le bouton de format
  const getFormatButtonClasses = () => {
    return `flex items-center gap-1 px-4 py-1.5 border-0 rounded-lg text-base font-medium cursor-pointer transition-all duration-200 whitespace-nowrap min-w-[70px] justify-center ${
      isDarkMode
        ? 'bg-gray-700 text-gray-100 hover:bg-gray-600'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    }
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
      <label htmlFor="filename-input" className={`
        block mb-3 text-base font-semibold
        ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}
      `}>
        {label}
      </label>
      <div className="flex flex-row gap-1.5 items-center mb-3">
        <input
          id="filename-input"
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          aria-label="Nom du fichier d'export"
          aria-describedby="filename-help"
          className={getInputClasses()}
        />
        <div id="filename-help" className="sr-only">
          Entrez le nom souhaité pour votre fichier exporté. L'extension sera ajoutée automatiquement selon le format choisi.
        </div>

        <div className="relative" id="format-dropdown">
          <button
            onClick={handleFormatClick}
            className={getFormatButtonClasses()}
            type="button"
            aria-label="Select export format"
            aria-expanded={showFormatDropdown}
            aria-haspopup="true"
          >
            {selectedFormat.toUpperCase()}
            <ChevronDownIcon className="w-3.5 h-3.5" />
          </button>

          {showFormatDropdown && (
            <div className={`
              absolute top-full right-0 mt-1 rounded-lg shadow-lg z-50 min-w-[120px] overflow-hidden
              ${isDarkMode ? 'bg-gray-800 border border-gray-600' : 'bg-white border border-gray-200'}
            `} role="menu" aria-label="Format options">
              {formats.map((format) => (
                <button
                  key={format.value}
                  onClick={() => handleFormatSelect(format.value)}
                  className={`
                    px-4 py-3 text-sm font-medium cursor-pointer transition-all duration-200
                    border-0 bg-transparent w-full text-left block
                    ${isDarkMode ? 'text-gray-100 hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}
                  `}
                  type="button"
                  role="menuitem"
                >
                  {format.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleButtonClick}
          className={getExportButtonClasses()}
          type="button"
          aria-label={`${buttonText} en ${selectedFormat.toUpperCase()}`}
          aria-describedby="export-button-help"
        >
          {showIcon && (
            <DocumentArrowDownIcon className="w-4 h-4" aria-hidden="true" />
          )}
          {buttonText}
        </button>
        <div id="export-button-help" className="sr-only">
          Cliquez pour exporter le document dans le format sélectionné avec le nom de fichier spécifié.
        </div>
      </div>
    </div>
  );
};

export default FileNameInput;
