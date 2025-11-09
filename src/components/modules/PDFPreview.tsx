import { useState, forwardRef } from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';
import PaginationControls from './PaginationControls';
import ZoomControls from './ZoomControls';
import PDFPreviewSkeleton from './PDFPreviewSkeleton';
import ScrollCircularSlider from '../ui/ScrollCircularSlider';
import { usePDFPreview } from '../../hooks/usePDFPreview';


interface PDFPreviewProps {
  markdown: string;
  previewTheme: string;
  previewZoom: number;
  isDarkMode: boolean;
  isLoading?: boolean;
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  totalPages?: number;
  setTotalPages?: (pages: number) => void;
  viewMode?: 'single' | 'all';
  onViewModeChange?: (mode: 'single' | 'all') => void;
  onZoomChange?: (zoom: number) => void;
}

const PDFPreview = forwardRef<HTMLDivElement, PDFPreviewProps>(({
  markdown,
  previewTheme,
  previewZoom,
  isDarkMode,
  isLoading = false,
  currentPage: externalCurrentPage,
  setCurrentPage: externalSetCurrentPage,
  totalPages: externalTotalPages,
  setTotalPages: externalSetTotalPages,
  viewMode: externalViewMode,
  onViewModeChange: externalOnViewModeChange,
  onZoomChange: externalOnZoomChange
}, ref) => {
  // Utiliser le hook pour la logique PDF
  const { processedHTML, pageContents, currentPage, totalPages, setCurrentPage } = usePDFPreview({
    markdown,
    previewTheme,
    currentPage: externalCurrentPage,
    setCurrentPage: externalSetCurrentPage,
    totalPages: externalTotalPages,
    setTotalPages: externalSetTotalPages
  });

  // États locaux pour l'UI
  const [internalViewMode, setInternalViewMode] = useState<'single' | 'all'>('all');
  const [scrollPageIndicator, setScrollPageIndicator] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);

  const viewMode = externalViewMode ?? internalViewMode;
  const onViewModeChange = externalOnViewModeChange ?? setInternalViewMode;
  const onZoomChange = externalOnZoomChange ?? (() => {});

  const getPreviewClasses = () => {
    return isDarkMode
      ? 'bg-slate-800 p-6 rounded-xl border border-slate-700'
      : 'bg-white p-6 rounded-xl border border-gray-200';
  };

  const getTitleClasses = () => {
    return isDarkMode
      ? 'm-0 text-lg font-bold text-slate-100 flex items-center gap-2'
      : 'm-0 text-lg font-bold text-slate-800 flex items-center gap-2';
  };

  const getInfoClasses = () => {
    return isDarkMode
      ? 'text-xs text-slate-400 flex items-center gap-2'
      : 'text-xs text-gray-500 flex items-center gap-2';
  };

  const getContentWrapperClasses = () => {
    return isDarkMode
      ? 'bg-slate-900 rounded-lg p-5 overflow-auto origin-top-left transition-transform duration-700 ease-in-out flex justify-center'
      : 'bg-gray-50 rounded-lg p-5 overflow-auto origin-top-left transition-transform duration-700 ease-in-out flex justify-center';
  };

  const getThemeClasses = () => {
    const themeClasses = {
      modern: 'font-sans text-slate-800 leading-snug text-xs',
      classic: 'font-serif text-gray-700 leading-relaxed text-[11px]',
      academic: 'font-serif text-gray-800 leading-loose text-[11px]',
      minimal: 'font-system text-gray-700 leading-tight text-xs'
    };
    return themeClasses[previewTheme as keyof typeof themeClasses] || themeClasses.modern;
  };

  const renderSinglePage = () => {
    const currentContent = pageContents[currentPage - 1] || processedHTML || '';

    return (
      <div className={`relative ${totalPages > 1 ? 'mb-2.5' : ''}`}>
        <div className="bg-white p-[10mm] pb-[5mm] rounded shadow-lg w-[210mm] h-[297mm] box-border overflow-hidden relative">
          {/* Header avec contrôles de pagination intégrés */}
          <div className="absolute top-0 left-0 right-0 h-[6mm] bg-gray-50 z-10 flex justify-center items-center px-[5mm] border-b border-gray-200">
            <div className="text-sm font-semibold text-gray-700">
              Page {currentPage} / {totalPages}
            </div>
          </div>

          {/* Contenu principal - hauteur limitée pour protéger le header */}
          <div className="h-[calc(100%)] overflow-hidden pt-[1mm]">
            <div
              className={getThemeClasses()}
              dangerouslySetInnerHTML={{ __html: currentContent }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Fonction pour gérer le scroll et détecter la page visible
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight - container.clientHeight;

    // Calculer la progression du scroll (0 à 1)
    const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    setScrollProgress(progress);

    // Calculer quelle page est principalement visible
    const currentPageIndex = Math.round(progress * (totalPages - 1));
    const visiblePage = Math.min(Math.max(1, currentPageIndex + 1), totalPages);

    setScrollPageIndicator(visiblePage);
  };

  // Fonction pour naviguer vers une position spécifique via le slider
  const scrollToPosition = (progress: number) => {
    const container = document.getElementById('scroll-container');
    if (!container) return;

    const scrollHeight = container.scrollHeight - container.clientHeight;
    const targetScrollTop = progress * scrollHeight;

    // Utiliser requestAnimationFrame pour un scroll ultra fluide
    requestAnimationFrame(() => {
      container.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
    });
  };

  // Fonction pour gérer le changement de progression depuis le slider
  const handleProgressChange = (progress: number, currentPage: number) => {
    setScrollProgress(progress);
    setScrollPageIndicator(currentPage);
  };

  const renderAllPages = () => {
    return (
      <div className="relative">
        {/* Conteneur scrollable avec hauteur d'une seule page A4 */}
        <div
          id="scroll-container"
          className="overflow-y-auto overflow-x-hidden"
          style={{
            height: '297mm', // Hauteur exacte d'une page A4
            width: '210mm',   // Largeur exacte d'une page A4
            scrollSnapType: 'y mandatory', // Snap automatique sur les pages
            scrollBehavior: 'smooth',
            scrollbarWidth: 'thin', // Scrollbar plus fine
            scrollbarColor: isDarkMode ? '#475569 #1e293b' : '#d1d5db #f9fafb', // Couleurs personnalisées
            scrollPaddingTop: '8px', // Marge intérieure pour le snap
            scrollPaddingBottom: '8px',
            transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
          onScroll={handleScroll}
        >
          <div className="space-y-0">
            {pageContents.map((pageContent, i) => (
              <div
                key={i}
                className="relative transition-all duration-300 ease-out"
                style={{
                  scrollSnapAlign: 'start', // Snap au début de chaque page
                  scrollSnapStop: 'always',  // Toujours s'arrêter sur une page
                  scrollMargin: '4px'        // Marge pour le snap
                }}
              >
                {/* Page A4 */}
                <div className="bg-white p-[10mm] pb-[5mm] shadow-lg w-[210mm] h-[297mm] box-border overflow-hidden relative">
                  {/* Header avec numéro de page */}
                  <div className="absolute top-0 left-0 right-0 h-[6mm] bg-gray-50 z-10 flex justify-center items-center border-b border-gray-200">
                    <span className="text-xs text-gray-700 font-semibold px-2.5 py-1 bg-white rounded-full border border-gray-300 shadow-sm">
                      Page {i + 1} / {totalPages}
                    </span>
                  </div>

                  {/* Contenu principal */}
                  <div className="h-[calc(100%)] overflow-hidden pt-[1mm]">
                    <div
                      className={getThemeClasses()}
                      dangerouslySetInnerHTML={{ __html: pageContent || processedHTML || '' }}
                    />
                  </div>
                </div>

                {/* Indicateur de page suivante (optionnel) */}
                {i < totalPages - 1 && (
                  <div className="h-8 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span>Page {i + 2}</span>
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Slider circulaire de contrôle de scroll */}
        <ScrollCircularSlider
          totalPages={totalPages}
          currentPage={scrollPageIndicator}
          progress={scrollProgress}
          isDarkMode={isDarkMode}
          onScrollToPosition={scrollToPosition}
          onProgressChange={handleProgressChange}
        />

        {/* Instructions de scroll */}
        {totalPages > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span>Scroll pour voir les autres pages</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Afficher le skeleton pendant le chargement
  if (isLoading) {
    return <PDFPreviewSkeleton isDarkMode={isDarkMode} viewMode={viewMode} />;
  }

  return (
    <div className={`${getPreviewClasses()} preview-container`}>
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center  align-center gap-2">
          <EyeIcon className="w-4 h-4" />

          <h3 className={getTitleClasses()}>
            Aperçu PDF
          </h3>
        </div>
        <div className={getInfoClasses()}>
          <span>Format: A4 (210×297mm)</span>
          <span>•</span>
          <span>{totalPages} page{totalPages > 1 ? 's' : ''}</span>
          <span>•</span>
          <span>Thème: {previewTheme}</span>
        </div>
      </div>

      {/* Pagination et contrôles de zoom en haut */}
      <div className="bg-transparent py-2 mb-3 flex justify-between items-center">
        <ZoomControls
          previewZoom={previewZoom}
          onZoomChange={onZoomChange}
          isDarkMode={isDarkMode}
        />
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          viewMode={viewMode}
          setCurrentPage={setCurrentPage}
          onViewModeChange={onViewModeChange}
          isDarkMode={isDarkMode}
        />
      </div>

      <div
        ref={ref}
        className={getContentWrapperClasses()}
        style={{ transform: `scale(${previewZoom / 100})` }}
      >
        <div className="flex flex-col items-center">
          {viewMode === 'single' ? renderSinglePage() : renderAllPages()}
        </div>
      </div>
    </div>
  );
});

PDFPreview.displayName = 'PDFPreview';

export default PDFPreview;
