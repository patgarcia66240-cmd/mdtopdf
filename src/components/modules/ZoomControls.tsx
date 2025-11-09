import React from 'react';
import { MinusIcon, PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface ZoomControlsProps {
  previewZoom: number;
  onZoomChange: (zoom: number) => void;
  isDarkMode: boolean;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({
  previewZoom,
  onZoomChange,
  isDarkMode
}) => {
  const handleZoomOut = () => {
    onZoomChange(Math.max(50, previewZoom - 10));
  };

  const handleZoomIn = () => {
    onZoomChange(Math.min(150, previewZoom + 10));
  };

  const handleReset = () => {
    onZoomChange(100);
  };

  const buttonBaseClasses = `px-1.5 py-1 border rounded text-xs flex items-center transition-all duration-200 hover:shadow-sm ${
    isDarkMode
      ? 'border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700'
      : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50'
  }`;

  const resetButtonClasses = `px-2 py-1 border rounded text-xs flex items-center transition-all duration-300 hover:shadow-sm ${
    isDarkMode
      ? 'border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700'
      : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
  }`;

  const zoomDisplayClasses = `px-2 py-1 text-xs font-semibold min-w-[45px] text-center rounded border ${
    isDarkMode
      ? 'bg-slate-800 text-slate-200 border-slate-600'
      : 'bg-white text-gray-900 border-gray-300'
  }`;

  return (
    <div className="flex items-center gap-2 ml-8" role="group" aria-label="Contrôles de zoom">
      <button
        onClick={handleZoomOut}
        className={buttonBaseClasses}
        title="Zoom arrière"
        aria-label="Réduire le zoom de l'aperçu"
        aria-pressed={false}
      >
        <MinusIcon className="w-3.5 h-3.5" aria-hidden="true" />
      </button>

      <span
        className={zoomDisplayClasses}
        role="status"
        aria-live="polite"
        aria-label={`Niveau de zoom actuel: ${previewZoom}%`}
      >
        {previewZoom}%
      </span>

      <button
        onClick={handleZoomIn}
        className={buttonBaseClasses}
        title="Zoom avant"
        aria-label="Augmenter le zoom de l'aperçu"
        aria-pressed={false}
      >
        <PlusIcon className="w-3.5 h-3.5" aria-hidden="true" />
      </button>

      <button
        onClick={handleReset}
        className={resetButtonClasses}
        title="Réinitialiser le zoom"
        aria-label="Réinitialiser le zoom à 100%"
        aria-pressed={false}
      >
        <ArrowPathIcon className="w-3 h-3" aria-hidden="true" />
      </button>
    </div>
  );
};

export default ZoomControls;
