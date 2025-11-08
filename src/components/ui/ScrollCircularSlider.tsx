import { useState } from 'react';

interface ScrollCircularSliderProps {
  totalPages: number;
  currentPage: number;
  progress: number;
  isDarkMode: boolean;
  onScrollToPosition: (progress: number) => void;
  onProgressChange: (progress: number, currentPage: number) => void;
}

const ScrollCircularSlider = ({
  totalPages,
  currentPage,
  progress,
  isDarkMode,
  onScrollToPosition,
  onProgressChange
}: ScrollCircularSliderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  // Gestion du drag sur le slider circulaire
  const handleSliderMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging) return;

      const slider = e.currentTarget as HTMLElement;
      const rect = slider.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;

      // Calculer l'angle de la souris par rapport au centre
      const angle = Math.atan2(moveEvent.clientY - centerY, 0);
      // Convertir l'angle en progression (0 à 1)
      let progress = (angle + Math.PI) / (2 * Math.PI);
      progress = Math.max(0, Math.min(1, progress));

      onProgressChange(progress, Math.round(progress * (totalPages - 1)) + 1);
      onScrollToPosition(progress);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Clic direct sur le cercle pour naviguer
  const handleSliderClick = (e: React.MouseEvent) => {
    if (isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;

    // Calculer la position du clic par rapport au centre
    const clickY = e.clientY - centerY;
    const angle = Math.atan2(clickY, 0);
    let progress = (angle + Math.PI) / (2 * Math.PI);
    progress = Math.max(0, Math.min(1, progress));

    onProgressChange(progress, Math.round(progress * (totalPages - 1)) + 1);
    onScrollToPosition(progress);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
      <div
        className={`relative w-12 h-12 rounded-full border-2 cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-gray-600 shadow-lg shadow-gray-500/50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}
        onMouseDown={handleSliderMouseDown}
        onClick={handleSliderClick}
        style={{ userSelect: 'none' }}
      >
        {/* Cercle de progression */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 48 48"
        >
          {/* Cercle de fond */}
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke={isDarkMode ? '#475569' : '#e5e7eb'}
            strokeWidth="4"
          />
          {/* Cercle de progression */}
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
            strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 20}`}
            strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress)}`}
            className="transition-all duration-300 ease-out"
            strokeLinecap="round"
          />
        </svg>

        {/* Point de navigation */}
        <div
          className="absolute w-3 h-3 bg-gray-600 rounded-full shadow-md transition-all duration-300 ease-out"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) rotate(${progress * 360 - 90}deg) translateX(16px) rotate(${-(progress * 360 - 90)}deg)`,
          }}
        />

        {/* Numéro de page au centre */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>
            {currentPage}
          </span>
        </div>

        {/* Icônes haut/bas */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </div>
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Info pages */}
      <div className="absolute top-14 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
          {currentPage}/{totalPages}
        </span>
      </div>
    </div>
  );
};

export default ScrollCircularSlider;