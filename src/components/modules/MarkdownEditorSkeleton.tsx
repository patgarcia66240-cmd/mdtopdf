import React from 'react';

interface MarkdownEditorSkeletonProps {
  showPreview?: boolean;
  isDarkMode: boolean;
}

const MarkdownEditorSkeleton: React.FC<MarkdownEditorSkeletonProps> = ({
  showPreview = false,
  isDarkMode
}) => {
  const baseClasses = isDarkMode
    ? 'bg-slate-800 text-slate-100'
    : 'bg-white text-slate-800';

  const skeletonClass = isDarkMode
    ? 'bg-gray-700 animate-pulse'
    : 'bg-gray-200 animate-pulse';

  const containerClasses = isDarkMode
    ? 'bg-slate-900 border-gray-600'
    : 'bg-gray-50 border-gray-300';

  const toolbarSkeleton = () => (
    <div className={`
      ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-200'}
      px-2 py-2 border rounded-t-lg flex gap-1 flex-wrap items-center
    `}>
      {/* Skeleton boutons toolbar */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className={`${skeletonClass} w-8 h-8 rounded-md`}
        />
      ))}
      {/* Skeleton bouton preview */}
      <div className={`${skeletonClass} w-8 h-8 rounded-md ml-auto`} />
    </div>
  );

  const editorContentSkeleton = () => (
    <div className={`
      ${containerClasses}
      border-l border-r border-b rounded-b-lg p-5 overflow-auto
      min-h-[400px] relative
    `}>
      {/* Skeleton lignes de texte */}
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            {/* Ligne de titre */}
            {i === 0 && (
              <div className={`${skeletonClass} h-5 w-32 rounded`} />
            )}
            {/* Lignes de contenu */}
            <div className={`${skeletonClass} h-4 w-full rounded`} />
            {i % 2 === 0 && (
              <div className={`${skeletonClass} h-4 w-3/4 rounded`} />
            )}
            {/* Ligne de liste */}
            {i === 3 && (
              <div className="flex items-center gap-2">
                <div className={`${skeletonClass} w-2 h-2 rounded-full`} />
                <div className={`${skeletonClass} h-4 w-1/2 rounded`} />
              </div>
            )}
            {/* Bloc de code */}
            {i === 5 && (
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} p-3 rounded border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                <div className={`${skeletonClass} h-3 w-full rounded mb-2`} />
                <div className={`${skeletonClass} h-3 w-4/5 rounded`} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const previewSkeleton = () => (
    <div className={`
      ${containerClasses}
      border-l border-r border-b rounded-b-lg p-5 overflow-auto
      min-h-[400px] relative
    `}>
      {/* Skeleton contenu aperçu */}
      <div className="space-y-4">
        {/* Skeleton titre H1 */}
        <div className={`${skeletonClass} h-7 w-48 rounded`} />

        {/* Skeleton paragraphe */}
        <div className="space-y-2">
          <div className={`${skeletonClass} h-4 w-full rounded`} />
          <div className={`${skeletonClass} h-4 w-5/6 rounded`} />
          <div className={`${skeletonClass} h-4 w-4/5 rounded`} />
        </div>

        {/* Skeleton sous-titre H2 */}
        <div className={`${skeletonClass} h-6 w-40 rounded mt-4`} />

        {/* Skeleton liste */}
        <div className="space-y-2 ml-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`${skeletonClass} w-2 h-2 rounded-full`} />
              <div className={`${skeletonClass} h-4 w-3/5 rounded`} />
            </div>
          ))}
        </div>

        {/* Skeleton tableau */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} p-3 rounded border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`${skeletonClass} h-3 w-full rounded`} />
            ))}
          </div>
        </div>

        {/* Skeleton bloc de code */}
        <div className={`${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'} p-4 rounded-lg border-2 ${isDarkMode ? 'border-blue-600' : 'border-blue-300'}`}>
          <div className="space-y-2">
            <div className={`${skeletonClass} h-3 w-full rounded`} />
            <div className={`${skeletonClass} h-3 w-4/5 rounded`} />
            <div className={`${skeletonClass} h-3 w-3/4 rounded`} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className={`${baseClasses} flex flex-col`}>
      {/* Header éditeur */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`${skeletonClass} w-5 h-5 rounded`} />
        <div className={`${skeletonClass} h-6 w-32 rounded`} />
      </div>

      {/* Toolbar skeleton */}
      {toolbarSkeleton()}

      {/* Conteneur A4 avec le contenu */}
      <div className={`
        w-full border-2 rounded-lg overflow-hidden relative
        ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}
        shadow-lg
      `}>
        <div className={`
          grid
          ${showPreview ? 'grid-cols-2' : 'grid-cols-1'}
          h-full
        `}>
          {/* Éditeur */}
          <div className="flex flex-col h-full">
            {editorContentSkeleton()}
          </div>

          {/* Aperçu (si visible) */}
          {showPreview && (
            <div className="flex flex-col h-full border-l ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}">
              {previewSkeleton()}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MarkdownEditorSkeleton;