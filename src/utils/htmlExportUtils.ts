/**
 * Utilitaires pour la génération d'exports HTML
 * Centralise la logique commune entre generateHTMLFromPreview et generateFallbackHTML
 */

export interface PageTemplateOptions {
  fileName: string;
  content: string;
  source: 'preview' | 'fallback';
  pageCount?: number;
  currentPage?: number;
}

/**
 * Génère les styles CSS communs pour les exports HTML
 */
export function getCommonExportStyles(): string {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    /* Styles de base pour l'export */
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #f5f5f5;
    }

    .preview-export {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 2px 4px;
      margin: 1px 0;
      font-family: 'Courier New', 'Consolas', monospace;
      font-size: 9px;
      line-height: 0.3;
      overflow-x: auto;
      white-space: pre;
      word-wrap: normal;
      overflow-wrap: normal;
    }

    .preview-code {
      background: none;
      padding: 0;
      border-radius: 0;
      font-family: inherit;
      font-size: inherit;
      color: inherit;
      white-space: pre;
    }

    /* Optimisation des blocs de code */
    .preview-export pre {
      background-color: #f8fafc !important;
      padding: 2px 4px !important;
      border-radius: 3px !important;
      border: 1px solid #e2e8f0 !important;
      overflow-x: auto !important;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
      font-size: 9px !important;
      line-height: 0.3 !important;
      margin: 1px 0 !important;
      white-space: pre-wrap !important;
      word-wrap: break-word !important;
    }

    .preview-export code {
      background-color: #f1f5f9 !important;
      padding: 2px 4px !important;
      border-radius: 3px !important;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
      font-size: 10px !important;
    }

    .preview-export pre code {
      background: none !important;
      padding: 0 !important;
      border: none !important;
      font-size: inherit !important;
    }

    /* Tableaux compacts */
    .preview-export table {
      width: 100% !important;
      border-collapse: collapse !important;
      margin: 8px 0 !important;
      font-size: 11px !important;
    }

    .preview-export th,
    .preview-export td {
      border: 1px solid #e2e8f0 !important;
      padding: 4px 6px !important;
      text-align: left !important;
    }

    .preview-export th {
      background-color: #f8fafc !important;
      font-weight: 600 !important;
      font-size: 10px !important;
    }

    /* Listes compactes */
    .preview-export ul,
    .preview-export ol {
      margin: 6px 0 !important;
      padding-left: 16px !important;
    }

    .preview-export li {
      margin: 1px 0 !important;
      line-height: 1.0 !important;
    }

    /* Titres compacts */
    .preview-export h1 {
      font-size: 16px !important;
      margin: 6px 0 2px 0 !important;
      line-height: 1.1 !important;
    }

    .preview-export h2 {
      font-size: 14px !important;
      margin: 5px 0 2px 0 !important;
      line-height: 1.1 !important;
    }

    .preview-export h3 {
      font-size: 12px !important;
      margin: 4px 0 1px 0 !important;
      line-height: 1.1 !important;
    }

    /* Paragraphes compacts */
    .preview-export p {
      margin: 0 !important;
      line-height: 0.5 !important;
    }

    .preview-export p:has(code) {
      margin: 0px 0 !important;
      line-height: 0.5 !important;
    }

    .preview-export p code {
      background-color: #f1f5f9 !important;
      padding: 1px 1px !important;
      border-radius: 2px !important;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
      font-size: 10px !important;
      margin: 0 !important;
      display: inline-block;
    }

    /* Blockquotes compacts */
    .preview-export blockquote {
      border-left: 3px solid #e2e8f0 !important;
      padding-left: 10px !important;
      margin: 6px 0 !important;
      font-style: italic !important;
      color: #6b7280 !important;
      line-height: 0.2 !important;
    }
  `;
}

/**
 * Génère les styles CSS pour l'impression
 */
export function getPrintStyles(): string {
  return `
    @media print {
      body {
        margin: 0;
        padding: 0;
        background: white;
        font-size: 11px !important;
        line-height: 0.3 !important;
      }

      .preview-export pre,
      .preview-export code {
        font-family: 'Courier New', monospace !important;
        font-size: 8px !important;
        line-height: 1.05 !important;
      }

      .preview-export pre {
        padding: 2px 3px !important;
        margin: 1px 0 !important;
        white-space: pre-wrap !important;
        word-wrap: break-word !important;
      }

      .preview-export table {
        font-size: 9px !important;
        margin: 4px 0 !important;
      }

      .preview-export th,
      .preview-export td {
        padding: 2px 4px !important;
      }

      .preview-export h1 { font-size: 14px !important; margin: 8px 0 3px 0 !important; }
      .preview-export h2 { font-size: 12px !important; margin: 6px 0 2px 0 !important; }
      .preview-export h3 { font-size: 11px !important; margin: 4px 0 1px 0 !important; }

      .preview-export p {
        margin: 2px 0 !important;
        line-height: 1.1 !important;
      }

      .preview-export p:has(code) {
        margin: 1px 0 !important;
        line-height: 1.05 !important;
      }

      .preview-export li {
        margin: 1px 0 !important;
        line-height: 1.1 !important;
      }

      .preview-export ul,
      .preview-export ol {
        margin: 2px 0 !important;
      }

      .preview-export blockquote {
        margin: 3px 0 !important;
        padding-left: 6px !important;
        line-height: 1.2 !important;
      }

      .preview-export {
        background: white;
        box-shadow: none;
        border: none;
        padding: 0;
        margin: 0;
        max-width: none;
      }

      .a4-pages-container {
        max-width: none;
        gap: 0;
        margin: 0;
        padding: 0;
      }

      .a4-page,
      .preview-export div[style*="aspect-ratio"] {
        width: 210mm !important;
        height: 297mm !important;
        max-width: 210mm !important;
        max-height: 297mm !important;
        border: 1px solid #333 !important;
        box-shadow: none !important;
        page-break-after: always !important;
        page-break-inside: avoid !important;
        margin: 0 !important;
        padding: 20mm 15mm !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
      }

      .a4-page:last-child,
      .preview-export div[style*="aspect-ratio"]:last-child {
        page-break-after: auto !important;
      }

      div[style*="border: 2px dashed"],
      div[style*="border: 1px solid #667eea"],
      div[style*="border-left: 4px solid #e53e3e"],
      div[style*="background: linear-gradient"] {
        display: none !important;
      }
    }
  `;
}

/**
 * Génère l'en-tête principal pour l'export
 */
export function generateMainHeader(fileName: string, pageCount?: number): string {
  const pageText = pageCount ? `${pageCount} page${pageCount > 1 ? 's' : ''} • ` : '';
  return `
    <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%); border-radius: 16px; border: 1px solid rgba(102, 126, 234, 0.2);">
      <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
        📄 Document A4 Exporté
      </h1>
      <p style="margin: 0; font-size: 16px; color: #6b7280; font-weight: 500;">
        ${fileName} • ${pageText}Généré le ${new Date().toLocaleDateString('fr-FR')}
      </p>
    </div>
  `;
}

/**
 * Génère le conteneur pour les pages A4
 */
export function generatePagesContainer(content: string, source: 'preview' | 'fallback'): string {
  if (source === 'preview') {
    return `
      <div class="a4-pages-container">
        ${content}
      </div>
    `;
  }

  return `
    <div class="content-wrapper">
      <div class="pages-container">
        ${content}
      </div>
    </div>
  `;
}

/**
 * Génère une page A4 individuelle pour le fallback
 */
export function generateA4Page(content: string, pageIndex: number, totalPages: number): string {
  return `
    <div style="position: relative; margin-bottom: ${pageIndex < totalPages - 1 ? '40px' : '0'}; page-break-after: ${pageIndex < totalPages - 1 ? 'always' : 'auto'};">
      <div style="background: #ffffff; width: 100%; height: calc(100vw * 297 / 210); max-height: 100vh; aspect-ratio: 210/297; margin: 0; padding: 3% 4%; box-sizing: border-box; border-radius: 8px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); border: 3px solid #1a202c; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; border: 2px dashed #484747ff; border-radius: 6px; margin: 3px; pointer-events: none; z-index: 2;"></div>
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; border: 1px solid #667eea; border-radius: 5px; margin: 8px; pointer-events: none; z-index: 1;"></div>

        <div style="position: absolute; top: 3%; right: 4%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 0.5% 1.5%; border-radius: 20px; font-size: clamp(10px, 1.5vw, 14px); font-weight: 600; box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4); z-index: 10;">
          ${pageIndex + 1}
        </div>

        <div style="color: #1e293b; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; font-size: clamp(11px, 1.8vw, 16px); height: calc(100% - 15%); margin-top: 6%; overflow-y: auto; position: relative; z-index: 1;">
          ${content}
        </div>

        <div style="position: absolute; bottom: 3%; left: 4%; right: 4%; display: flex; justify-content: space-between; align-items: center; padding-top: 2%; border-top: 1px solid #e2e8f0;">
          <div style="font-size: clamp(9px, 1.2vw, 12px); color: #9ca3af; font-style: italic;">
            Généré par MDtoPDF Pro
          </div>
          <div style="font-size: clamp(9px, 1.2vw, 12px); color: #6b7280; font-weight: 500;">
            Page ${pageIndex + 1} sur ${totalPages}
          </div>
        </div>

        <div style="position: absolute; top: -5px; left: -5px; width: 20px; height: 20px; border-left: 4px solid #e53e3e; border-top: 4px solid #e53e3e; border-radius: 4px 0 0 0; z-index: 3;"></div>
        <div style="position: absolute; top: -5px; right: -5px; width: 20px; height: 20px; border-right: 4px solid #e53e3e; border-top: 4px solid #e53e3e; border-radius: 0 4px 0 0; z-index: 3;"></div>
        <div style="position: absolute; bottom: -5px; left: -5px; width: 20px; height: 20px; border-left: 4px solid #e53e3e; border-bottom: 4px solid #e53e3e; border-radius: 0 0 0 4px; z-index: 3;"></div>
        <div style="position: absolute; bottom: -5px; right: -5px; width: 20px; height: 20px; border-right: 4px solid #e53e3e; border-bottom: 4px solid #e53e3e; border-radius: 0 0 4px 0; z-index: 3;"></div>

        <div style="position: absolute; top: -10px; left: -10px; right: -10px; bottom: -10px; border: 1px solid #cbd5e0; border-radius: 12px; pointer-events: none; z-index: 0;"></div>

        <div style="position: absolute; top: 50%; left: -15px; right: -15px; height: 2px; background: linear-gradient(90deg, transparent, #667eea, transparent); transform: translateY(-50%); z-index: 1;"></div>
        <div style="position: absolute; left: 50%; top: -15px; bottom: -15px; width: 2px; background: linear-gradient(0deg, transparent, #667eea, transparent); transform: translateX(-50%); z-index: 1;"></div>
      </div>

      ${pageIndex < totalPages - 1 ? `
        <div style="position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 8px;">
          <div style="width: 40px; height: 1px; background: linear-gradient(90deg, transparent, #cbd5e0, transparent);"></div>
          <div style="width: 8px; height: 8px; background: #cbd5e0; border-radius: 50%;"></div>
          <div style="width: 40px; height: 1px; background: linear-gradient(90deg, #cbd5e0, transparent, transparent);"></div>
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Génère le template HTML complet
 */
export function generateHTMLTemplate(options: PageTemplateOptions): string {
  const { fileName, content, source, pageCount } = options;

  const commonStyles = getCommonExportStyles();
  const printStyles = getPrintStyles();
  const mainHeader = generateMainHeader(fileName, pageCount);
  const pagesContainer = generatePagesContainer(content, source);

  let bodyStyles = '';
  let containerClass = '';

  if (source === 'preview') {
    bodyStyles = 'background-color: #ffffff; padding: 20px;';
    containerClass = 'preview-export';
  } else {
    bodyStyles = 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; min-height: 100vh;';
    containerClass = 'preview-container';
  }

  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName}</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
    <style>
      ${commonStyles}
      ${printStyles}

      .preview-container {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        padding: 40px;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        max-width: 1400px;
        margin: 0 auto;
      }

      .content-wrapper {
        background: rgba(248, 250, 252, 0.8);
        border-radius: 16px;
        padding: 30px;
        overflow: visible;
        display: flex;
        justify-content: center;
      }

      .pages-container {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 20px;
        width: 100%;
      }

      .a4-pages-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30px;
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
      }

      .a4-page {
        background-color: #ffffff;
        width: 100%;
        max-width: 210mm;
        height: 297mm;
        aspect-ratio: 210/297;
        border: 3px solid #1a202c;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        border-radius: 8px;
        position: relative;
        overflow: hidden;
        margin: 0 auto;
        page-break-after: always;
      }

      .preview-export div[style*="aspect-ratio"] {
        background-color: #ffffff !important;
        border: 3px solid #1a202c !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
        border-radius: 8px !important;
        position: relative !important;
        overflow: hidden !important;
        max-width: 210mm !important;
        width: 100% !important;
        aspect-ratio: 210/297 !important;
        margin: 0 auto !important;
        page-break-after: always !important;
      }

      @media screen {
        body {
          background: #f5f5f5;
          margin: 0;
          padding: 0;
        }
      }

      h1 { color: #1e293b; font-size: 18px; margin: 16px 0 8px 0; font-weight: 700; }
      h2 { color: #334155; font-size: 15px; margin: 12px 0 6px 0; font-weight: 600; }
      h3 { color: #475569; font-size: 13px; margin: 10px 0 4px 0; font-weight: 600; }
      p { margin: 8px 0; }
      ul, ol { margin: 8px 0; padding-left: 16px; }
      li { margin: 3px 0; }
      blockquote {
        border-left: 3px solid #e5e7eb;
        padding-left: 12px;
        margin: 8px 0;
        font-style: italic;
        color: #6b7280;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 6px 0;
        font-size: 0.75em;
      }
      th {
        border: 1px solid #e5e7eb;
        padding: 3px 5px;
        background-color: #f8fafc;
        text-align: left;
        font-weight: 600;
        font-size: 0.7em;
      }
      td {
        border: 1px solid #e5e7eb;
        padding: 3px 5px;
        font-size: 0.7em;
      }
      code {
        background-color: #f8fafc;
        padding: 2px 4px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
        font-size: 0.9em;
      }
      pre {
        background-color: #f8fafc;
        padding: 8px;
        border-radius: 4px;
        overflow-x: auto;
        font-family: 'Courier New', monospace;
        font-size: 0.65em;
        border: 1px solid #e5e7eb;
      }
      a { color: #3b82f6; text-decoration: none; }
      a:hover { color: #2563eb; text-decoration: underline; }
    </style>
</head>
<body style="${bodyStyles}">
  <div class="${containerClass}">
    ${source === 'fallback' ? mainHeader : ''}
    ${pagesContainer}
  </div>
</body>
</html>`;
}
