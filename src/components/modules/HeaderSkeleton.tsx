import React from 'react';

interface HeaderSkeletonProps {
  isDarkMode: boolean;
}

const HeaderSkeleton: React.FC<HeaderSkeletonProps> = ({ isDarkMode }) => {
  const baseClasses = isDarkMode
    ? 'bg-slate-800 border-slate-700'
    : 'bg-white border-gray-200';

  const skeletonClass = isDarkMode
    ? 'bg-gray-700 animate-pulse'
    : 'bg-gray-200 animate-pulse';

  return (
    <header className={`${baseClasses} px-4 py-2 border-b flex justify-between items-center sticky top-0 z-[100] ${isDarkMode ? 'shadow-[0_2px_8px_rgba(0,0,0,0.3)]' : 'shadow-[0_2px_8px_rgba(0,0,0,0.1)]'}`}>
      {/* Logo et titre */}
      <div className="flex items-center gap-3">
        <div className={`${skeletonClass} h-12 w-12 mr-3 rounded-lg`} />
        <div className={`${skeletonClass} h-6 w-32 rounded`} />
      </div>

      {/* Navigation */}
      <nav className="flex gap-1 items-end">
        {/* Onglets */}
        <div className="flex gap-1 items-end">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`${skeletonClass} px-5 py-2 rounded-t-lg min-w-[120px] flex items-center gap-2`}
            >
              <div className={`${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} w-4 h-4 rounded animate-pulse`} />
              <div className={`${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} h-4 w-16 rounded animate-pulse`} />
            </div>
          ))}
        </div>

        {/* Espacement */}
        <div className="w-4" />

        {/* Bouton thème */}
        <div className={`${skeletonClass} px-4 py-2 rounded-lg flex items-center gap-2`}>
          <div className={`${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} w-4 h-4 rounded animate-pulse`} />
          <div className={`${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} h-4 w-12 rounded animate-pulse`} />
        </div>

        {/* Bouton export */}
        <div className={`${skeletonClass} px-4 py-2 rounded-lg flex items-center gap-2`}>
          <div className={`${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} w-4 h-4 rounded animate-pulse`} />
          <div className={`${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} h-4 w-16 rounded animate-pulse`} />
        </div>
      </nav>
    </header>
  );
};

export default HeaderSkeleton;