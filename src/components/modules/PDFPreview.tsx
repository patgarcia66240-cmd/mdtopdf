import { useState, useEffect, forwardRef } from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';
import { marked } from 'marked';
import PaginationControls from './PaginationControls';
import PDFPreviewSkeleton from './PDFPreviewSkeleton';


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
  /*onZoomChange: externalOnZoomChange*/
}, ref) => {
  // Utiliser les états externes ou les états locaux
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalViewMode, setInternalViewMode] = useState<'single' | 'all'>('all');
  const [internalTotalPages, setInternalTotalPages] = useState(1);
  const [processedHTML, setProcessedHTML] = useState('');

  const currentPage = externalCurrentPage ?? internalCurrentPage;
  const setCurrentPage = externalSetCurrentPage ?? setInternalCurrentPage;
  const totalPages = externalTotalPages ?? internalTotalPages;
  const setTotalPages = externalSetTotalPages ?? setInternalTotalPages;
  const viewMode = externalViewMode ?? internalViewMode;
  const onViewModeChange = externalOnViewModeChange ?? setInternalViewMode;
  /* const onZoomChange = externalOnZoomChange ?? (() => { });
*/
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
      ? 'bg-slate-900 rounded-lg p-5 overflow-auto origin-top-left transition-transform duration-200 flex justify-center'
      : 'bg-gray-50 rounded-lg p-5 overflow-auto origin-top-left transition-transform duration-200 flex justify-center';
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


  // Thèmes CSS pour l'aperçu
  const themeStyles = {
    modern: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      color: '#1e293b',
      lineHeight: '1.4',
      fontSize: '12px'
    },
    classic: {
      fontFamily: 'Georgia, serif',
      color: '#374151',
      lineHeight: '1.5',
      fontSize: '11px'
    },
    academic: {
      fontFamily: 'Times New Roman, serif',
      color: '#1f2937',
      lineHeight: '1.6',
      fontSize: '11px'
    },
    minimal: {
      fontFamily: 'system-ui, sans-serif',
      color: '#374151',
      lineHeight: '1.3',
      fontSize: '12px'
    }
  };

  const currentTheme = themeStyles[previewTheme as keyof typeof themeStyles] || themeStyles.modern;

  const getProcessedHTML = async (markdown: string): Promise<string> => {
    // IMPORTANT: Traiter les pagebreaks AVANT la conversion markdown
    // car marked.js ne conserve pas bien les commentaires HTML
    let processedMarkdown = markdown;

    // Support des sauts de page - convertir en balises spéciales
    processedMarkdown = processedMarkdown.replace(/<!--\s*pagebreak\s*-->|<!--\s*newpage\s*-->/gi, '\n<!--PAGEBREAK-->\n');
    processedMarkdown = processedMarkdown.replace(/\\pagebreak|\\newpage/gi, '\n<!--PAGEBREAK-->\n');

    // Utiliser marked avec les bonnes options pour les tableaux
    const options = {
      breaks: false,    // Désactivé car on insère <br> manuellement
      gfm: true,        // GitHub Flavored Markdown (important pour les tableaux)
      sanitize: false,  // NE PAS échapper le HTML (essentiel pour les tableaux et <br>)
      pedantic: false   // Détecte les sauts de ligne
    };

    let html = await marked(processedMarkdown, options);

    // POST-TRAITEMENT: Corriger le markdown gras qui n'a pas été converti par marked.js
    // Problème: les **texte** dans les conteneurs HTML ne sont pas toujours convertis
    const convertBoldMarkdown = (text: string): string => {
      const parts = text.split(/(<[^>]*>)/);
      return parts.map((part, index) => {
        if (index % 2 === 0) { // Contenu textuel uniquement
          return part
            .replace(/\*\*([^*\n\r]+)\*\*/g, '<strong>$1</strong>')
            .replace(/__([^_\n\r]+)__/g, '<strong>$1</strong>');
        }
        return part; // Balises HTML inchangées
      }).join('');
    };

    // Fonction pour réduire la police dans les colonnes
    const reduceFontInColumns = (html: string): string => {
      // Plusieurs approches différentes

      // 1. Traitement direct des conteneurs flex/grid
      html = html.replace(/<div[^>]*style="display:\s*(flex|grid)[^"]*"[^>]*>(.*?)<\/div>/gs, (match) => {
        return match.replace(/<strong([^>]*)>(.*?)<\/strong>/g, '<strong$1 style="font-weight: 700 !important; font-size: 0.75em !important; line-height: 1.2 !important;">$2</strong>');
      });

      // 2. Traitement des strong dans flex/grid (au cas où les strong sont seuls)
      html = html.replace(/<div[^>]*style="display:\s*(flex|grid)[^"]*">[^<]*<strong([^>]*)>(.*?)<\/strong>/g, (_, attrs, content) => {
        return `<div${attrs} style="display: flex"><strong style="font-weight: 700 !important; font-size: 0.75em !important; line-height: 1.2 !important;">${content}</strong>`;
      });

      // 3. Traitement forcé avec styles inline plus forts
      html = html.replace(/<strong([^>]*)>(.*?)<\/strong>/g, (match, attrs, content) => {
        // Vérifier si ce strong est potentiellement dans une colonne
        const precedingDivs = html.substring(0, html.indexOf(match)).split('<div');
        const lastDiv = precedingDivs[precedingDivs.length - 1];
        if (lastDiv && (lastDiv.includes('display: flex') || lastDiv.includes('display: grid'))) {
          return `<strong${attrs} style="font-weight: 600 !important; font-size: 0.75em !important; line-height: 1.2 !important;">${content}</strong>`;
        }
        return match;
      });

      return html;
    };

    html = convertBoldMarkdown(html);

    // Réduire la police dans les colonnes après conversion du markdown
    html = reduceFontInColumns(html);    // Ajouter des styles CSS spécifiques pour forcer la police dans les colonnes
    const columnStyles = `
      <style>
        /* Styles universels pour les colonnes */
        .markdown-body div[style*="display: flex"] strong,
        .markdown-body div[style*="display: grid"] strong,
        div[style*="display: flex"] strong,
        div[style*="display: grid"] strong {
          font-size: 0.75em !important;
          line-height: 1.2 !important;
          font-weight: 600 !important;
        }

        /* Styles encore plus spécifiques */
        .preview-container div[style*="display: flex"] strong,
        .preview-container div[style*="display: grid"] strong {
          font-size: 0.75em !important;
          line-height: 1.2 !important;
          font-weight: 600 !important;
        }

        /* Forcer tous les strong dans les conteneurs flex */
        [style*="display: flex"] > strong,
        [style*="display: grid"] > strong {
          font-size: 0.75em !important;
          line-height: 1.2 !important;
          font-weight: 600 !important;
        }
      </style>
    `;
    html += columnStyles;
    console.log('Final HTML with column styles:', html);

    // Forcer le style gras pour tous les strong/b (au cas où)
    html = html.replace(/<strong([^>]*)>/g, '<strong$1 style="font-weight: 700 !important;">');
    html = html.replace(/<b([^>]*)>/g, '<b$1 style="font-weight: 700 !important;">');

    // Appliquer les styles du thème
    const themeCSS = `
      color: ${currentTheme.color};
      font-family: ${currentTheme.fontFamily};
      line-height: ${currentTheme.lineHeight};
      font-size: ${currentTheme.fontSize};
    `;

    html = html.replace(/<h1([^>]*)>/g, `<h1$1 class="text-slate-900 text-lg font-black my-4" >`);
    html = html.replace(/<h2([^>]*)>/g, `<h2$1 class="text-slate-700 text-base font-black my-3" `);
    html = html.replace(/<h3([^>]*)>/g, `<h3$1 class="text-slate-600 text-sm font-black my-3" >`);
    html = html.replace(/<h4([^>]*)>/g, `<h4$1 class="text-slate-500 text-xs font-bold my-2" >`);

    // Styles pour le texte gras (strong et b)
    html = html.replace(/<strong([^>]*)>/g, `<strong$1 style="font-weight: 700; color: inherit;">`);
    html = html.replace(/<b([^>]*)>/g, `<b$1 style="font-weight: 700; color: inherit;">`);

    // Styles pour le texte italique (em et i)
    html = html.replace(/<em([^>]*)>/g, `<em$1 style="font-style: italic; color: inherit;">`);
    html = html.replace(/<i([^>]*)>/g, `<i$1 style="font-style: italic; color: inherit;">`);

    // Ajouter un style global pour forcer l'héritage du font-weight dans tous les conteneurs
    html = html.replace(/<div([^>]*style="[^"]*display:\s*(flex|grid)[^"]*"[^>]*)>/g, (match, attrs) => {
      if (!attrs.includes('font-weight')) {
        return `<div${attrs.replace(/style="/, 'style="font-weight: inherit; ')}>`;
      }
      return match;
    });

    // Traitement des paragraphes pour préserver les sauts de ligne avec Tailwind
    html = html.replace(/<p([^>]*)>/g, `<p$1 class="my-2" style="${themeCSS}">`);
    html = html.replace(/<ul([^>]*)>/g, `<ul$1 class="my-2 ml-4 list-disc" style="${themeCSS}">`);
    html = html.replace(/<ol([^>]*)>/g, `<ol$1 class="my-2 ml-4 list-decimal" style="${themeCSS}">`);
    html = html.replace(/<li([^>]*)>/g, `<li$1 class="my-1">`);
    html = html.replace(/<code([^>]*)>/g, `<code$1 class="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">`);

    // Appliquer des classes Tailwind pour les blocs de code JavaScript et Python avec accent bleu
    html = html.replace(/<pre([^>]*)><code([^>]*class="[^"]*language-javascript[^"]*"[^>]*)>/g, (_, preAttrs, codeAttrs) => {
      return `<pre${preAttrs} class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-500 shadow-lg overflow-x-auto font-mono text-sm my-3 whitespace-pre-wrap relative before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-blue-500 before:to-blue-400 before:rounded-t-xl"><code${codeAttrs} class="bg-transparent">`;
    });

    html = html.replace(/<pre([^>]*)><code([^>]*class="[^"]*language-js[^"]*"[^>]*)>/g, (_, preAttrs, codeAttrs) => {
      return `<pre${preAttrs} class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-500 shadow-lg overflow-x-auto font-mono text-sm my-3 whitespace-pre-wrap relative before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-blue-500 before:to-blue-400 before:rounded-t-xl"><code${codeAttrs} class="bg-transparent">`;
    });

    // Appliquer le même style bleu pour les blocs de code Python
    html = html.replace(/<pre([^>]*)><code([^>]*class="[^"]*language-python[^"]*"[^>]*)>/g, (_, preAttrs, codeAttrs) => {
      return `<pre${preAttrs} class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-500 shadow-lg overflow-x-auto font-mono text-sm my-3 whitespace-pre-wrap relative before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-blue-500 before:to-blue-400 before:rounded-t-xl"><code${codeAttrs} class="bg-transparent">`;
    });

    html = html.replace(/<pre([^>]*)><code([^>]*class="[^"]*language-py[^"]*"[^>]*)>/g, (_, preAttrs, codeAttrs) => {
      return `<pre${preAttrs} class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-500 shadow-lg overflow-x-auto font-mono text-sm my-3 whitespace-pre-wrap relative before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-blue-500 before:to-blue-400 before:rounded-t-xl"><code${codeAttrs} class="bg-transparent">`;
    });

    // Appliquer la classe par défaut Tailwind pour les autres blocs pre
    html = html.replace(/<pre(?!\s+class="[^"]*code-block)([^>]*)>/g, (match, attrs) => {
      if (attrs.includes('class=')) {
        // Le pre a déjà une classe, on ajoute les classes Tailwind
        return match.replace(/class="([^"]*)"/, 'class="$1 bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200 shadow-sm overflow-x-auto font-mono text-xs my-2 whitespace-pre-wrap"');
      } else {
        // Le pre n'a pas de classe, on ajoute les classes Tailwind
        return `<pre class="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200 shadow-sm overflow-x-auto font-mono text-xs my-2 whitespace-pre-wrap"${attrs}>`;
      }
    });

    html = html.replace(/<blockquote([^>]*)>/g, `<blockquote$1 class="border-l-4 border-gray-300 pl-4 my-2 italic text-gray-600">`);
    html = html.replace(/<table([^>]*)>/g, `<table$1 class="w-auto border-collapse my-2 text-xs">`);
    html = html.replace(/<th([^>]*)>/g, `<th$1 class="border border-gray-200 px-1.5 py-1 bg-gray-50 text-left text-[10px] font-semibold whitespace-nowrap">`);
    html = html.replace(/<td([^>]*)>/g, `<td$1 class="border border-gray-200 px-1.5 py-0.5 text-[10px] whitespace-nowrap">`);

    // Nettoyer les combinaisons <br>\n pour éviter les doublons
    html = html.replace(/<br>\s*\n/g, '<br>');
    html = html.replace(/\n\s*<br>/g, '<br>');

    // S'assurer que les paragraphes vides créent des espaces
    html = html.replace(/<p><\/p>/g, '<p class="p-preview">&nbsp;</p>');

    // Support des sauts de page - convertir les marqueurs en HTML
    html = html.replace(/<!--PAGEBREAK-->/gi, '<div style="page-break-before: always; clear: both;"></div>');

    // Pas besoin d'ajouter la classe markdown-body - elle ajoute des marges indésirables

    return html;
  };



  // Fonction pour diviser le contenu en pages en fonction des sauts de page
  const splitContentByPages = (html: string): string[] => {
    const pageBreakPattern = /<div[^>]*style="page-break-before:\s*always[^"]*"[^>]*>/gi;
    const hasPageBreaks = pageBreakPattern.test(html);

    if (hasPageBreaks) {
      // Utiliser les sauts de page explicites
      const parts = html.split(pageBreakPattern);
      const pages: string[] = [];

      parts.forEach((part, _) => {
        if (part.trim()) {
          pages.push(part.trim());
        }
      });

      // Si on n'a pas trouvé de contenu valide, retourner le HTML complet
      if (pages.length === 0) {
        return [html];
      }

      return pages;
    } else {
      // Pas de sauts de page explicites - tout mettre sur une seule page
      return [html];
    }
  };

  // Traiter le HTML quand le markdown ou le thème change
  useEffect(() => {
    const processHTML = async () => {
      const html = await getProcessedHTML(markdown);
      setProcessedHTML(html);
      const pages = splitContentByPages(html);
      setTotalPages(pages.length);
      setCurrentPage(1);
    };
    processHTML();
  }, [markdown, previewTheme, setTotalPages, setCurrentPage]);

  const pageContents = processedHTML ? splitContentByPages(processedHTML) : [''];

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

  const renderAllPages = () => {
    const pages = [];

    for (let i = 0; i < totalPages; i++) {
      const pageContent = pageContents[i] || processedHTML || '';

      pages.push(
        <div key={i} className={`relative ${i < totalPages - 1 ? 'mb-5' : ''}`}>
          {/* Page A4 */}
          <div className="bg-white p-[10mm] pb-[5mm] rounded shadow-lg w-[210mm] h-[297mm] box-border overflow-hidden relative">
            {/* Header avec numéro de page (lecture seule pour mode "tout afficher") */}
            <div className="absolute top-0 left-0 right-0 h-[6mm] bg-gray-50 z-10 flex justify-center items-center border-b border-gray-200">
              <span className="text-xs text-gray-700 font-semibold px-2.5 py-1 bg-white rounded-full border border-gray-300 shadow-sm">
                Page {i + 1} / {totalPages}
              </span>
            </div>

            {/* Contenu principal - hauteur limitée pour protéger le header */}
            <div className="h-[calc(100%)] overflow-hidden pt-[1mm]">
              <div
                className={getThemeClasses()}
                dangerouslySetInnerHTML={{ __html: pageContent }}
              />
            </div>
          </div>

          {/* Séparateur de page */}
          {i < totalPages - 1 && (
            <div className={`absolute bottom-[-10px] left-0 right-0 h-px ${isDarkMode ? 'bg-slate-600' : 'bg-gray-300'} flex items-center justify-center`}>
            </div>
          )}
        </div>
      );
    }
    return pages;
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
          <span>•</span>
          <span>{previewZoom}%</span>
        </div>
      </div>

      {/* Pagination en haut */}
      <div className="bg-transparent py-2 mb-3 flex justify-center items-center">
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