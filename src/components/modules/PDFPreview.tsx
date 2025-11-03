import React, { useState, useEffect } from 'react';
import { EyeIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { marked } from 'marked';

interface PDFPreviewProps {
  markdown: string;
  previewTheme: string;
  previewZoom: number;
  isDarkMode: boolean;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({
  markdown,
  previewTheme,
  previewZoom,
  isDarkMode
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('all');
  const [processedHTML, setProcessedHTML] = useState('');

  const previewStyle = {
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  };

  const titleStyle = {
    margin: 0,
    fontSize: '18px',
    fontWeight: '700',
    color: isDarkMode ? '#f1f5f9' : '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const contentWrapperStyle = {
    backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
    borderRadius: '8px',
    padding: '20px',
    overflow: 'auto',
    transform: `scale(${previewZoom / 100})`,
    transformOrigin: 'top left',
    transition: 'transform 0.2s ease',
    display: 'flex',
    justifyContent: 'center'
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    padding: '0mm 20mm 20mm 20mm', // Marge supérieure réduite
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    width: '210mm', // A4 width exact
    height: '297mm', // A4 height exact
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative'
  };

  // Thèmes CSS pour l'aperçu
  const themeStyles = {
    modern: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      color: '#1e293b',
      lineHeight: '1.6'
    },
    classic: {
      fontFamily: 'Georgia, serif',
      color: '#374151',
      lineHeight: '1.8'
    },
    academic: {
      fontFamily: 'Times New Roman, serif',
      color: '#1f2937',
      lineHeight: '2.0'
    },
    minimal: {
      fontFamily: 'system-ui, sans-serif',
      color: '#374151',
      lineHeight: '1.5'
    }
  };

  const currentTheme = themeStyles[previewTheme as keyof typeof themeStyles] || themeStyles.modern;

  const getProcessedHTML = async (markdown: string): Promise<string> => {
    // Utiliser marked avec les bonnes options pour les tableaux
    const options = {
      breaks: false,    // Désactivé car on insère <br> manuellement
      gfm: true,        // GitHub Flavored Markdown (important pour les tableaux)
      sanitize: false,  // NE PAS échapper le HTML (essentiel pour les tableaux et <br>)
      pedantic: false   // Détecte les sauts de ligne
    };

    let html = await marked(markdown, options);

    // Debug: voir ce que marked produit
    console.log('Markdown input:', markdown);
    console.log('Marked output:', html);

    // Appliquer les styles du thème
    const themeCSS = `
      color: ${currentTheme.color};
      font-family: ${currentTheme.fontFamily};
      line-height: ${currentTheme.lineHeight};
    `;

    html = html.replace(/<h1([^>]*)>/g, `<h1$1 style="color: #1e293b; font-size: 28px; margin: 24px 0 16px 0; font-weight: 700;">`);
    html = html.replace(/<h2([^>]*)>/g, `<h2$1 style="color: #334155; font-size: 22px; margin: 20px 0 12px 0; font-weight: 600;">`);
    html = html.replace(/<h3([^>]*)>/g, `<h3$1 style="color: #475569; font-size: 18px; margin: 16px 0 10px 0; font-weight: 600;">`);
    // Traitement des paragraphes pour préserver les sauts de ligne
    html = html.replace(/<p([^>]*)>([\s\S]*?)<\/p>/g, (_, attrs, content) => {
      return `<p${attrs} style="margin: 12px 0; ${themeCSS}">${content}</p>`;
    });
    html = html.replace(/<ul([^>]*)>/g, `<ul$1 style="margin: 12px 0; padding-left: 24px; ${themeCSS}">`);
    html = html.replace(/<ol([^>]*)>/g, `<ol$1 style="margin: 12px 0; padding-left: 24px; ${themeCSS}">`);
    html = html.replace(/<li([^>]*)>/g, `<li$1 style="margin: 6px 0;">`);
    html = html.replace(/<code([^>]*)>/g, `<code$1 style="background-color: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">`);
    html = html.replace(/<pre([^>]*)>/g, `<pre$1 style="background-color: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 0.9em; margin: 16px 0; white-space: pre-wrap;">`);
    html = html.replace(/<blockquote([^>]*)>/g, `<blockquote$1 style="border-left: 4px solid #e5e7eb; padding-left: 16px; margin: 16px 0; font-style: italic; color: #6b7280;">`);
    html = html.replace(/<table([^>]*)>/g, `<table$1 style="width: 100%; border-collapse: collapse; margin: 16px 0;">`);
    html = html.replace(/<th([^>]*)>/g, `<th$1 style="border: 1px solid #e5e7eb; padding: 8px 12px; background-color: #f8fafc; text-align: left; font-weight: 600;">`);
    html = html.replace(/<td([^>]*)>/g, `<td$1 style="border: 1px solid #e5e7eb; padding: 8px 12px;">`);

    // Nettoyer les combinaisons <br>\n pour éviter les doublons
    html = html.replace(/<br>\s*\n/g, '<br>');
    html = html.replace(/\n\s*<br>/g, '<br>');

    // Traitement simple des styles sans altérer le HTML
    html = html.replace(/<p([^>]*)>/g, `<p$1 style="margin: 12px 0; ${themeCSS}">`);

    // S'assurer que les paragraphes vides créent des espaces
    html = html.replace(/<p><\/p>/g, '<p style="margin: 12px 0;">&nbsp;</p>');

    // Support des sauts de page
    html = html.replace(/<!--\s*pagebreak\s*-->|<!--\s*newpage\s*-->/gi, '<div style="page-break-before: always;"></div>');
    html = html.replace(/\\pagebreak|\\newpage/gi, '<div style="page-break-before: always;"></div>');

    return html;
  };

  const calculatePages = (content: string): number => {
    // Compter les <br> qui représentent les vrais sauts de ligne créés par Entrée
    const brCount = (content.match(/<br>/gi) || []).length;

    // Environ 15-20 sauts de ligne par page A4 (plus réaliste pour voir la pagination)
    const brPerPage = 40;

    // Calcul basé sur les <br>
    const pagesByBr = Math.ceil(brCount / brPerPage);

    // Au cas où, garder une estimation de secours basée sur la longueur
    const charCount = content.length;
    const pagesByChars = Math.ceil(charCount / 2000);

    // Prendre le maximum entre les <br> et les caractères
    const pages = Math.max(pagesByBr, pagesByChars);

    // Forcer 2 pages pour tester la pagination
    return Math.max(2, pages);
  };

  const [totalPages, setTotalPages] = useState(1);

  // Traiter le HTML quand le markdown ou le thème change
  useEffect(() => {
    const processHTML = async () => {
      const html = await getProcessedHTML(markdown);
      setProcessedHTML(html);
      setTotalPages(calculatePages(markdown));
      setCurrentPage(1);
    };
    processHTML();
  }, [markdown, previewTheme]);

  const splitContentByPages = (html: string, numPages: number): string[] => {
    // Créer des pages simples basées sur le contenu total
    if (numPages <= 1) {
      return [html];
    }

    // Diviser le HTML en pages égales
    const lines = html.split('\n');
    const linesPerPage = Math.ceil(lines.length / numPages);
    const pages: string[] = [];

    for (let i = 0; i < numPages; i++) {
      const start = i * linesPerPage;
      const end = Math.min(start + linesPerPage, lines.length);
      const pageLines = lines.slice(start, end);

      if (pageLines.length > 0) {
        pages.push(pageLines.join('\n'));
      }
    }

    // S'assurer qu'on a le bon nombre de pages
    while (pages.length < numPages) {
      pages.push('<div style="min-height: 200px; padding: 20px; border: 1px dashed #ccc;">Page vide</div>');
    }

    return pages.slice(0, numPages);
  };

  const pageContents = processedHTML ? splitContentByPages(processedHTML, totalPages) : [''];

  const renderSinglePage = () => {
    const currentContent = pageContents[currentPage - 1] || processedHTML || '';

    return (
      <div style={{ position: 'relative' }}>
        <div style={contentStyle}>
          <div
            dangerouslySetInnerHTML={{ __html: currentContent }}
          />
        </div>

        {/* Numéro de page dans le pied de page */}
        <div style={{
          position: 'absolute',
          bottom: '10mm',
          right: '20mm',
          fontSize: '12px',
          color: isDarkMode ? '#64748b' : '#9ca3af',
          fontStyle: 'italic'
        }}>
          Page {currentPage} / {totalPages}
        </div>
      </div>
    );
  };

  const renderAllPages = () => {
    const pages = [];

    for (let i = 0; i < totalPages; i++) {
      const pageContent = pageContents[i] || processedHTML || '';

      pages.push(
        <div key={i} style={{ position: 'relative', marginBottom: i < totalPages - 1 ? '20px' : '0' }}>
          {/* Page A4 */}
          <div style={contentStyle}>
            <div
              dangerouslySetInnerHTML={{ __html: pageContent }}
            />
          </div>

          {/* Séparateur de page */}
          {i < totalPages - 1 && (
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              left: '0',
              right: '0',
              height: '1px',
              backgroundColor: isDarkMode ? '#475569' : '#d1d5db',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                padding: '0 12px',
                fontSize: '11px',
                color: isDarkMode ? '#64748b' : '#9ca3af',
                border: `1px solid ${isDarkMode ? '#475569' : '#d1d5db'}`,
                borderRadius: '12px'
              }}>
                Page {i + 1} / {totalPages}
              </div>
            </div>
          )}
        </div>
      );
    }

    return pages;
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
        marginTop: '20px',
        padding: '16px',
        backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
        borderRadius: '12px',
        border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
      }}>
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            backgroundColor: currentPage === 1
              ? (isDarkMode ? '#374151' : '#e5e7eb')
              : (isDarkMode ? '#3b82f6' : '#2563eb'),
            border: 'none',
            borderRadius: '8px',
            color: currentPage === 1
              ? (isDarkMode ? '#6b7280' : '#9ca3af')
              : '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <ChevronLeftIcon style={{ width: '16px', height: '16px' }} />
          Précédent
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: '600',
            color: isDarkMode ? '#f1f5f9' : '#1e293b'
          }}>
            Page {currentPage} / {totalPages}
          </span>
        </div>

        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            backgroundColor: currentPage === totalPages
              ? (isDarkMode ? '#374151' : '#e5e7eb')
              : (isDarkMode ? '#3b82f6' : '#2563eb'),
            border: 'none',
            borderRadius: '8px',
            color: currentPage === totalPages
              ? (isDarkMode ? '#6b7280' : '#9ca3af')
              : '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Suivant
          <ChevronRightIcon style={{ width: '16px', height: '16px' }} />
        </button>

        {/* Bouton pour changer de mode de vue */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginLeft: '16px',
          paddingLeft: '16px',
          borderLeft: `1px solid ${isDarkMode ? '#475569' : '#d1d5db'}`
        }}>
          <button
            onClick={() => setViewMode(viewMode === 'single' ? 'all' : 'single')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: isDarkMode ? '#374151' : '#f1f5f9',
              border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
              borderRadius: '6px',
              color: isDarkMode ? '#f1f5f9' : '#374151',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {viewMode === 'single' ? 'Voir tout' : 'Vue page'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={previewStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>
          <EyeIcon style={{ width: '18px', height: '18px' }} />
          Aperçu PDF
        </h3>
        <div style={{
          fontSize: '12px',
          color: isDarkMode ? '#64748b' : '#6b7280',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
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
      {renderPagination()}

      <div style={contentWrapperStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {viewMode === 'single' ? renderSinglePage() : renderAllPages()}
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;
