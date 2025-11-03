import React from 'react';
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

  const contentStyle = {
    backgroundColor: '#ffffff',
    padding: '20mm', // Marges A4 standards
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    width: '210mm', // A4 width exact
    height: '297mm', // A4 height exact
    boxSizing: 'border-box',
    overflow: 'hidden'
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

  const getProcessedHTML = (markdown: string) => {
    let html = marked(markdown);

    // Appliquer les styles du thème
    const themeCSS = `
      color: ${currentTheme.color};
      font-family: ${currentTheme.fontFamily};
      line-height: ${currentTheme.lineHeight};
    `;

    html = html.replace(/<h1([^>]*)>/g, `<h1$1 style="color: #1e293b; font-size: 28px; margin: 24px 0 16px 0; font-weight: 700;">`);
    html = html.replace(/<h2([^>]*)>/g, `<h2$1 style="color: #334155; font-size: 22px; margin: 20px 0 12px 0; font-weight: 600;">`);
    html = html.replace(/<h3([^>]*)>/g, `<h3$1 style="color: #475569; font-size: 18px; margin: 16px 0 10px 0; font-weight: 600;">`);
    html = html.replace(/<p([^>]*)>/g, `<p$1 style="margin: 12px 0; ${themeCSS}">`);
    html = html.replace(/<ul([^>]*)>/g, `<ul$1 style="margin: 12px 0; padding-left: 24px; ${themeCSS}">`);
    html = html.replace(/<ol([^>]*)>/g, `<ol$1 style="margin: 12px 0; padding-left: 24px; ${themeCSS}">`);
    html = html.replace(/<li([^>]*)>/g, `<li$1 style="margin: 6px 0;">`);
    html = html.replace(/<code([^>]*)>/g, `<code$1 style="background-color: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">`);
    html = html.replace(/<pre([^>]*)>/g, `<pre$1 style="background-color: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 0.9em; margin: 16px 0;">`);
    html = html.replace(/<blockquote([^>]*)>/g, `<blockquote$1 style="border-left: 4px solid #e5e7eb; padding-left: 16px; margin: 16px 0; font-style: italic; color: #6b7280;">`);
    html = html.replace(/<table([^>]*)>/g, `<table$1 style="width: 100%; border-collapse: collapse; margin: 16px 0;">`);
    html = html.replace(/<th([^>]*)>/g, `<th$1 style="border: 1px solid #e5e7eb; padding: 8px 12px; background-color: #f8fafc; text-align: left; font-weight: 600;">`);
    html = html.replace(/<td([^>]*)>/g, `<td$1 style="border: 1px solid #e5e7eb; padding: 8px 12px;">`);

    return html;
  };

  const calculatePages = (content: string): number => {
    // Estimation simple du nombre de pages (environ 400-500 mots par page A4)
    const wordsPerPage = 450;
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    return Math.ceil(wordCount / wordsPerPage);
  };

  const totalPages = calculatePages(markdown);
  const processedHTML = getProcessedHTML(markdown);

  const renderPages = () => {
    const pages = [];

    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <div key={i} style={{ position: 'relative', marginBottom: i < totalPages - 1 ? '20px' : '0' }}>
          {/* Page A4 */}
          <div style={contentStyle}>
            <div
              dangerouslySetInnerHTML={{ __html: processedHTML }}
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

      <div style={contentWrapperStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {renderPages()}
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;