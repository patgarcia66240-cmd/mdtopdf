import React from 'react';

interface PDFControlPanelSkeletonProps {
  isDarkMode: boolean;
}

const PDFControlPanelSkeleton: React.FC<PDFControlPanelSkeletonProps> = ({ isDarkMode }) => {
  const baseClasses = isDarkMode
    ? 'bg-slate-800 text-slate-100 border-slate-700'
    : 'bg-white text-slate-800 border-gray-200';

  const skeletonClass = isDarkMode
    ? 'bg-gray-700 animate-pulse'
    : 'bg-gray-200 animate-pulse';

  const inputSkeletonClass = isDarkMode
    ? 'bg-gray-800 border-gray-600 text-gray-100'
    : 'bg-white border-gray-300 text-gray-900';

  return (
    <div className={`
      ${baseClasses}
      p-6 rounded-xl border mb-4
    `}>
      {/* Header du panneau */}
      <div className="flex items-center gap-2 mb-5">
        <div className={`${skeletonClass} w-5 h-5 rounded`} />
        <div className={`${skeletonClass} h-5 w-32 rounded`} />
      </div>

      {/* Section Nom du fichier */}
      <div className="flex flex-col gap-1.5 items-start mb-4">
        <div className={`${skeletonClass} h-4 w-40 rounded mb-2`} />
        <div className="flex flex-row gap-1.5 items-center w-full">
          {/* Input du nom de fichier */}
          <div className={`
            flex-1 px-4 py-1 border-2 rounded-lg outline-none
            ${inputSkeletonClass}
          `}>
            <div className={`${skeletonClass} h-4 w-32 rounded`} />
          </div>

          {/* Bouton format */}
          <div className={`
            flex items-center gap-1 px-4 py-1.5 border-0 rounded-lg
            ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-700'}
          `}>
            <div className={`${skeletonClass} w-3.5 h-3.5 rounded`} />
            <div className={`${skeletonClass} h-3 w-8 rounded`} />
          </div>

          {/* Bouton export */}
          <div className={`
            flex items-center gap-1.5 px-4 py-1.5 rounded-lg
            bg-gradient-to-r from-gray-500 to-gray-600
          `}>
            <div className={`${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} w-4 h-4 rounded animate-pulse`} />
            <div className={`${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} h-4 w-16 rounded animate-pulse`} />
          </div>
        </div>
      </div>

      {/* Section options de format et mise en page */}
      <div className="flex gap-1.5 items-center p-1.5 rounded-lg border mb-4">
        {/* Format A4 */}
        <div className="flex items-center gap-1.5 min-w-[100px]">
          <div className={`${skeletonClass} w-3.5 h-3.5 rounded`} />
          <div className={`
            px-1 py-0.5 text-xs border rounded w-12 h-6
            ${inputSkeletonClass}
          `}>
            <div className={`${skeletonClass} h-3 w-6 rounded m-auto mt-0.5`} />
          </div>
        </div>

        {/* Orientation */}
        <div className="flex items-center gap-1.5 min-w-[110px]">
          <div className={`${skeletonClass} w-3.5 h-3.5 rounded`} />
          <div className={`
            px-1 py-0.5 text-xs border rounded w-16 h-6
            ${inputSkeletonClass}
          `}>
            <div className={`${skeletonClass} h-3 w-8 rounded m-auto mt-0.5`} />
          </div>
        </div>

        {/* Marges */}
        <div className="flex items-center gap-1.5 min-w-[80px]">
          <div className={`${skeletonClass} w-3.5 h-3.5 rounded`} />
          <div className={`
            px-1 py-0.5 text-xs border rounded w-10 h-6
            ${inputSkeletonClass}
          `}>
            <div className={`${skeletonClass} h-3 w-4 rounded m-auto mt-0.5`} />
          </div>
          <div className={`${skeletonClass} h-2 w-8 rounded text-xs`} />
        </div>

        {/* Police */}
        <div className="flex items-center gap-1.5 min-w-[75px]">
          <div className={`${skeletonClass} w-3.5 h-3.5 rounded`} />
          <div className={`
            px-1 py-0.5 text-xs border rounded w-9 h-6
            ${inputSkeletonClass}
          `}>
            <div className={`${skeletonClass} h-3 w-4 rounded m-auto mt-0.5`} />
          </div>
          <div className={`${skeletonClass} h-2 w-6 rounded text-xs`} />
        </div>
      </div>

      {/* Section thème de l'aperçu */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`${skeletonClass} w-3.5 h-3.5 rounded`} />
          <div className={`${skeletonClass} h-3 w-32 rounded`} />
        </div>
        <div className="flex gap-2">
          {/* Boutons de thème */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`
                flex items-center gap-1.5 px-3 py-2 rounded-lg cursor-pointer
                ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-700'}
              `}
            >
              <div className={`${skeletonClass} w-3.5 h-3.5 rounded`} />
              <div className={`${skeletonClass} h-3 w-12 rounded`} />
            </div>
          ))}
        </div>
      </div>

      {/* Section contrôle de zoom */}
      <div className="flex flex-row items-center gap-4">
        <div className="flex items-center min-w-[80px]">
          <div className={`${skeletonClass} w-3.5 h-3.5 mr-1.5 rounded`} />
          <div className={`${skeletonClass} h-3 w-12 rounded`} />
        </div>

        <div className="flex items-center gap-2 flex-1">
          {/* Bouton moins */}
          <div className={`
            px-1 py-1 border rounded cursor-pointer
            ${inputSkeletonClass}
          `}>
            <div className={`${skeletonClass} w-3.5 h-3.5 rounded m-auto`} />
          </div>

          {/* Slider zoom */}
          <div className="flex-1 flex items-center relative">
            {/* Piste du slider */}
            <div className={`
              w-full h-0.5 rounded-full relative
              ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}
            `}>
              {/* Piste remplie (progress) - simulation à 75% */}
              <div className={`
                absolute top-0 left-0 h-0.5 rounded-full
                ${isDarkMode ? 'bg-gray-500' : 'bg-gray-500'}
              `} style={{ width: '75%' }} />

              {/* Curseur du slider */}
              <div className={`
                absolute top-1/2 -translate-y-1/2
                w-3 h-3 rounded-full border-2 cursor-pointer
                ${isDarkMode
                  ? 'bg-gray-700 border-gray-500 shadow-lg'
                  : 'bg-white border-gray-400 shadow-lg'
                }
              `} style={{ left: '75%' }}>
                {/* Centre du curseur */}
                <div className={`
                  w-1.5 h-1.5 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}
                `} />
              </div>

              {/* Marques de graduations */}
              <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between">
                {/* Marque 50% */}
                <div className={`
                  w-0.5 h-2 -translate-y-1/2 absolute
                  ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}
                `} style={{ left: '0%' }} />

                {/* Marque 75% (position actuelle) */}
                <div className={`
                  w-0.5 h-3 -translate-y-1/2 absolute
                  ${isDarkMode ? 'bg-gray-400' : 'bg-gray-600'}
                `} style={{ left: '50%' }} />

                {/* Marque 100% */}
                <div className={`
                  w-0.5 h-2 -translate-y-1/2 absolute
                  ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}
                `} style={{ left: '100%' }} />
              </div>

              {/* Effet de focus simulé */}
              <div className={`
                absolute inset-0 rounded-full
                ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-100/50'}
              `} />
            </div>
          </div>

          {/* Bouton plus */}
          <div className={`
            px-1 py-1 border rounded cursor-pointer
            ${inputSkeletonClass}
          `}>
            <div className={`${skeletonClass} w-3.5 h-3.5 rounded m-auto`} />
          </div>

          {/* Bouton reset */}
          <div className={`
            px-2 py-1 border rounded-lg text-xs cursor-pointer
            ${inputSkeletonClass}
          `}>
            <div className={`${skeletonClass} w-3 h-3 rounded m-auto`} />
          </div>
        </div>

        {/* Pourcentage zoom */}
        <div className={`
          text-xs w-10 text-center
          ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
        `}>
          <div className={`${skeletonClass} h-3 w-8 rounded`} />
        </div>
      </div>
    </div>
  );
};

export default PDFControlPanelSkeleton;