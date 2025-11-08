import React from 'react';

interface PDFPreviewSkeletonProps {
  isDarkMode: boolean;
  viewMode?: 'single' | 'all';
}

const PDFPreviewSkeleton: React.FC<PDFPreviewSkeletonProps> = ({
  isDarkMode,
  viewMode = 'all'
}) => {
  const baseClasses = isDarkMode
    ? 'bg-slate-800 text-slate-100 border-slate-700'
    : 'bg-white text-slate-800 border-gray-200';

  const skeletonClass = isDarkMode
    ? 'bg-gray-700 animate-pulse'
    : 'bg-gray-200 animate-pulse';

  const headerInfoSkeleton = () => (
    <div className="flex justify-between items-center mb-5">
      <div className="flex items-center gap-2">
        <div className={`${skeletonClass} w-4 h-4 rounded`} />
        <div className={`${skeletonClass} h-5 w-32 rounded`} />
      </div>
      <div className="flex items-center gap-2">
        <div className={`${skeletonClass} h-3 w-20 rounded`} />
        <div className={`${skeletonClass} w-1 h-1 rounded-full`} />
        <div className={`${skeletonClass} h-3 w-16 rounded`} />
        <div className={`${skeletonClass} w-1 h-1 rounded-full`} />
        <div className={`${skeletonClass} h-3 w-16 rounded`} />
        <div className={`${skeletonClass} w-1 h-1 rounded-full`} />
        <div className={`${skeletonClass} h-3 w-12 rounded`} />
      </div>
    </div>
  );

  const paginationSkeleton = () => (
    <div className="bg-transparent py-2 mb-3 flex justify-center items-center">
      <div className={`${skeletonClass} px-4 py-2 rounded-lg flex items-center gap-2`}>
        <div className={`${skeletonClass} w-6 h-6 rounded`} />
        <div className={`${skeletonClass} h-4 w-16 rounded`} />
        <div className={`${skeletonClass} w-6 h-6 rounded`} />
        <div className={`${skeletonClass} h-3 w-12 rounded mx-2`} />
        <div className={`${skeletonClass} w-6 h-6 rounded`} />
        <div className={`${skeletonClass} h-4 w-16 rounded`} />
        <div className={`${skeletonClass} w-6 h-6 rounded`} />
      </div>
    </div>
  );

  const a4PageSkeleton = (pageNumber?: number, showPageHeader = true) => (
    <div className={`
      relative ${pageNumber && pageNumber < 3 ? 'mb-2.5' : ''}
    `}>
      <div className={`
        bg-white p-[10mm] pb-[5mm] rounded shadow-lg
        w-[210mm] h-[297mm] box-border overflow-hidden relative
      `}>
        {/* Header avec numéro de page */}
        {showPageHeader && (
          <div className="absolute top-0 left-0 right-0 h-[6mm] bg-gray-50 z-10 flex justify-center items-center px-[5mm] border-b border-gray-200">
            <div className={`${skeletonClass} h-3 w-20 rounded`} />
            {pageNumber && (
              <div className={`${skeletonClass} h-3 w-16 rounded ml-2`} />
            )}
          </div>
        )}

        {/* Contenu principal de la page A4 */}
        <div className="h-[calc(100%)] overflow-hidden pt-[1mm]">
          <div className="p-4 space-y-4">
            {/* Titre principal */}
            <div className={`${skeletonClass} h-8 w-48 rounded mb-6`} />

            {/* Premier paragraphe */}
            <div className="space-y-2 mb-4">
              <div className={`${skeletonClass} h-4 w-full rounded`} />
              <div className={`${skeletonClass} h-4 w-5/6 rounded`} />
              <div className={`${skeletonClass} h-4 w-4/5 rounded`} />
              <div className={`${skeletonClass} h-4 w-full rounded`} />
            </div>

            {/* Sous-titre */}
            <div className={`${skeletonClass} h-6 w-40 rounded mb-4`} />

            {/* Liste à puces */}
            <div className="space-y-2 ml-4 mb-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`${skeletonClass} w-2 h-2 rounded-full`} />
                  <div className={`${skeletonClass} h-3 w-3/5 rounded`} />
                </div>
              ))}
            </div>

            {/* Sous-titre niveau 2 */}
            <div className={`${skeletonClass} h-5 w-32 rounded mb-3`} />

            {/* Tableau simulé */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} p-3 rounded border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} mb-4`}>
              <div className="grid grid-cols-2 gap-2">
                <div className={`${skeletonClass} h-3 w-full rounded`} />
                <div className={`${skeletonClass} h-3 w-full rounded`} />
                <div className={`${skeletonClass} h-3 w-4/5 rounded`} />
                <div className={`${skeletonClass} h-3 w-3/5 rounded`} />
                <div className={`${skeletonClass} h-3 w-full rounded`} />
                <div className={`${skeletonClass} h-3 w-2/3 rounded`} />
              </div>
            </div>

            {/* Bloc de code */}
            <div className={`
              ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}
              p-4 rounded-xl border-2
              ${isDarkMode ? 'border-blue-600' : 'border-blue-300'}
              mb-4
            `}>
              <div className="space-y-2">
                <div className={`${skeletonClass} h-3 w-full rounded`} />
                <div className={`${skeletonClass} h-3 w-4/5 rounded`} />
                <div className={`${skeletonClass} h-3 w-3/4 rounded`} />
                <div className={`${skeletonClass} h-3 w-5/6 rounded`} />
              </div>
            </div>

            {/* Citation */}
            <div className={`
              ${isDarkMode ? 'border-l-gray-600' : 'border-l-gray-300'}
              border-l-4 pl-4 italic
            `}>
              <div className={`${skeletonClass} h-4 w-full rounded mb-2`} />
              <div className={`${skeletonClass} h-4 w-3/4 rounded`} />
            </div>

            {/* Texte de fin de page */}
            <div className="space-y-2 mt-6">
              <div className={`${skeletonClass} h-4 w-5/6 rounded`} />
              <div className={`${skeletonClass} h-4 w-full rounded`} />
              <div className={`${skeletonClass} h-4 w-4/5 rounded`} />
            </div>
          </div>
        </div>
      </div>

      {/* Séparateur de page (sauf pour la dernière page) */}
      {pageNumber && pageNumber < 2 && (
        <div className={`
          absolute bottom-[-10px] left-0 right-0 h-px
          ${isDarkMode ? 'bg-slate-600' : 'bg-gray-300'}
          flex items-center justify-center
        `} />
      )}
    </div>
  );

  const renderSinglePage = () => (
    <div className="flex flex-col items-center">
      {a4PageSkeleton(1, true)}
    </div>
  );

  const renderAllPages = () => {
    const pages = [1, 2, 3]; // Simuler 3 pages

    return (
      <div className="flex flex-col items-center space-y-5">
        {pages.map((pageNum) => (
          <div key={pageNum}>
            {a4PageSkeleton(pageNum, true)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`
      ${isDarkMode ? 'bg-slate-800 p-6 rounded-xl border border-slate-700' : 'bg-white p-6 rounded-xl border border-gray-200'}
      preview-container
    `}>
      {/* Header info */}
      {headerInfoSkeleton()}

      {/* Pagination controls */}
      {paginationSkeleton()}

      {/* Contenu wrapper avec zoom */}
      <div className={`
        ${isDarkMode ? 'bg-slate-900 rounded-lg p-5 overflow-auto' : 'bg-gray-50 rounded-lg p-5 overflow-auto'}
        origin-top-left transition-transform duration-200 flex justify-center
      `}>
        {viewMode === 'single' ? renderSinglePage() : renderAllPages()}
      </div>
    </div>
  );
};

export default PDFPreviewSkeleton;