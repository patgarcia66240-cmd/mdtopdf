import React from 'react';

interface FileImportSkeletonProps {
  isDarkMode: boolean;
}

const FileImportSkeleton: React.FC<FileImportSkeletonProps> = ({ isDarkMode }) => {
  const skeletonClass = isDarkMode
    ? 'bg-gray-700 animate-pulse'
    : 'bg-gray-200 animate-pulse';

  return (
    <div className={`
      ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}
      p-4 rounded-xl border
    `}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className={`${skeletonClass} w-5 h-5 rounded`} />
          <div className={`${skeletonClass} h-5 w-48 rounded`} />
        </div>
      </div>

      {/* Zone de dépôt compacte */}
      <div className={`
        border-2 border-dashed rounded-lg p-4 text-center mb-3
        ${isDarkMode ? 'border-gray-600 bg-slate-900' : 'border-gray-300 bg-gray-50'}
      `}>
        {/* Icône */}
        <div className={`${skeletonClass} w-8 h-8 rounded mx-auto mb-2`} />

        {/* Texte principal */}
        <div className={`${skeletonClass} h-4 w-40 rounded mx-auto mb-1`} />

        {/* Bouton */}
        <div className={`
          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md
          ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}
          mt-2
        `}>
          <div className={`${skeletonClass} w-3 h-3 rounded`} />
          <div className={`${skeletonClass} h-3 w-20 rounded`} />
        </div>
      </div>

      {/* Un seul fichier simulé */}
      <div className={`
        flex items-center justify-between
        p-2 rounded-md border mb-3
        ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'}
      `}>
        <div className="flex items-center gap-2">
          <div className={`${skeletonClass} w-4 h-4 rounded`} />
          <div>
            <div className={`${skeletonClass} h-3 w-24 rounded mb-1`} />
            <div className={`${skeletonClass} h-2.5 w-16 rounded`} />
          </div>
        </div>
        <div className={`${skeletonClass} w-3 h-3 rounded`} />
      </div>

      {/* Instructions miniatures */}
      <div className={`
        p-2 rounded-md text-xs
        ${isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-gray-50 border border-gray-200'}
      `}>
        <div className={`${skeletonClass} h-3 w-20 rounded mb-1`} />
        <div className="space-y-1">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={`${skeletonClass} w-1 h-1 rounded-full`} />
              <div className={`${skeletonClass} h-2.5 w-24 rounded`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileImportSkeleton;