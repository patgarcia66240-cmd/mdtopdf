import { useState, useEffect, useCallback } from 'react';
import { marked } from 'marked';

interface UsePDFPreviewOptions {
  markdown: string;
  previewTheme: string;
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  totalPages?: number;
  setTotalPages?: (pages: number) => void;
}

export const usePDFPreview = ({
  markdown,
  previewTheme,
  currentPage: externalCurrentPage,
  setCurrentPage: externalSetCurrentPage,
  totalPages: externalTotalPages,
  setTotalPages: externalSetTotalPages
}: UsePDFPreviewOptions) => {
  // États internes pour la gestion des pages
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalTotalPages, setInternalTotalPages] = useState(1);
  const [processedHTML, setProcessedHTML] = useState('');

  // Utiliser les états externes ou internes
  const currentPage = externalCurrentPage ?? internalCurrentPage;
  const setCurrentPage = externalSetCurrentPage ?? setInternalCurrentPage;
  const totalPages = externalTotalPages ?? internalTotalPages;
  const setTotalPages = externalSetTotalPages ?? setInternalTotalPages;

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

  // Fonction optimisée pour traiter le markdown
  const getProcessedHTML = useCallback(async (markdown: string): Promise<string> => {
    // IMPORTANT: Traiter les pagebreaks AVANT la conversion markdown
    let processedMarkdown = markdown;

    // Support des sauts de page - convertir en balises spéciales
    processedMarkdown = processedMarkdown.replace(/<!--\s*pagebreak\s*-->|<!--\s*newpage\s*-->/gi, '\n<!--PAGEBREAK-->\n');
    processedMarkdown = processedMarkdown.replace(/\\pagebreak|\\newpage/gi, '\n<!--PAGEBREAK-->\n');

    // Utiliser marked avec les bonnes options pour les tableaux
    const options = {
      breaks: false,
      gfm: true,
      sanitize: false,
      pedantic: false
    };

    let html = await marked(processedMarkdown, options);

    // POST-TRAITEMENT: Corriger le markdown gras
    const convertBoldMarkdown = (text: string): string => {
      const parts = text.split(/(<[^>]*>)/);
      return parts.map((part, index) => {
        if (index % 2 === 0) {
          return part
            .replace(/\*\*([^*\n\r]+)\*\*/g, '<strong>$1</strong>')
            .replace(/__([^_\n\r]+)__/g, '<strong>$1</strong>');
        }
        return part;
      }).join('');
    };

    html = convertBoldMarkdown(html);

    // Appliquer les styles du thème
    const themeCSS = `
      color: ${currentTheme.color};
      font-family: ${currentTheme.fontFamily};
      line-height: ${currentTheme.lineHeight};
      font-size: ${currentTheme.fontSize};
    `;

    // Styles pour les éléments HTML
    html = html.replace(/<h1([^>]*)>/g, `<h1$1 class="text-slate-900 text-lg font-black my-4">`);
    html = html.replace(/<h2([^>]*)>/g, `<h2$1 class="text-slate-700 text-base font-black my-3">`);
    html = html.replace(/<h3([^>]*)>/g, `<h3$1 class="text-slate-600 text-sm font-black my-3">`);
    html = html.replace(/<h4([^>]*)>/g, `<h4$1 class="text-slate-500 text-xs font-bold my-2">`);

    html = html.replace(/<strong([^>]*)>/g, `<strong$1 style="font-weight: 700; color: inherit;">`);
    html = html.replace(/<b([^>]*)>/g, `<b$1 style="font-weight: 700; color: inherit;">`);
    html = html.replace(/<em([^>]*)>/g, `<em$1 style="font-style: italic; color: inherit;">`);
    html = html.replace(/<i([^>]*)>/g, `<i$1 style="font-style: italic; color: inherit;">`);

    html = html.replace(/<p([^>]*)>/g, `<p$1 class="my-2" style="${themeCSS}">`);
    html = html.replace(/<ul([^>]*)>/g, `<ul$1 class="my-2 ml-4 list-disc" style="${themeCSS}">`);
    html = html.replace(/<ol([^>]*)>/g, `<ol$1 class="my-2 ml-4 list-decimal" style="${themeCSS}">`);
    html = html.replace(/<li([^>]*)>/g, `<li$1 class="my-1">`);

    html = html.replace(/<code([^>]*)>/g, `<code$1 class="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">`);
    html = html.replace(/<pre([^>]*)><code([^>]*class="[^"]*language-javascript[^"]*"[^>]*)>/g, (_, preAttrs, codeAttrs) => {
      return `<pre${preAttrs} class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-500 shadow-lg overflow-x-auto font-mono text-sm my-3 whitespace-pre-wrap relative before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-blue-500 before:to-blue-400 before:rounded-t-xl"><code${codeAttrs} class="bg-transparent">`;
    });

    html = html.replace(/<pre([^>]*)><code([^>]*class="[^"]*language-js[^"]*"[^>]*)>/g, (_, preAttrs, codeAttrs) => {
      return `<pre${preAttrs} class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-500 shadow-lg overflow-x-auto font-mono text-sm my-3 whitespace-pre-wrap relative before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-blue-500 before:to-blue-400 before:rounded-t-xl"><code${codeAttrs} class="bg-transparent">`;
    });

    html = html.replace(/<pre([^>]*)><code([^>]*class="[^"]*language-python[^"]*"[^>]*)>/g, (_, preAttrs, codeAttrs) => {
      return `<pre${preAttrs} class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-500 shadow-lg overflow-x-auto font-mono text-sm my-3 whitespace-pre-wrap relative before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-blue-500 before:to-blue-400 before:rounded-t-xl"><code${codeAttrs} class="bg-transparent">`;
    });

    html = html.replace(/<pre(?!\s+class="[^"]*code-block)([^>]*)>/g, (match, attrs) => {
      if (attrs.includes('class=')) {
        return match.replace(/class="([^"]*)"/, 'class="$1 bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200 shadow-sm overflow-x-auto font-mono text-xs my-2 whitespace-pre-wrap"');
      } else {
        return `<pre class="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200 shadow-sm overflow-x-auto font-mono text-xs my-2 whitespace-pre-wrap"${attrs}>`;
      }
    });

    html = html.replace(/<blockquote([^>]*)>/g, `<blockquote$1 class="border-l-4 border-gray-300 pl-4 my-2 italic text-gray-600">`);
    html = html.replace(/<table([^>]*)>/g, `<table$1 class="w-auto border-collapse my-2 text-xs">`);
    html = html.replace(/<th([^>]*)>/g, `<th$1 class="border border-gray-200 px-1.5 py-1 bg-gray-50 text-left text-[10px] font-semibold whitespace-nowrap">`);
    html = html.replace(/<td([^>]*)>/g, `<td$1 class="border border-gray-200 px-1.5 py-0.5 text-[10px] whitespace-nowrap">`);

    // Support des sauts de page
    html = html.replace(/<!--PAGEBREAK-->/gi, '<div style="page-break-before: always; clear: both;"></div>');

    return html;
  }, [currentTheme]);

  // Fonction pour diviser le contenu en pages
  const splitContentByPages = useCallback((html: string): string[] => {
    const pageBreakPattern = /<div[^>]*style="page-break-before:\s*always[^"]*"[^>]*>/gi;
    const hasPageBreaks = pageBreakPattern.test(html);

    if (hasPageBreaks) {
      const parts = html.split(pageBreakPattern);
      const pages: string[] = [];

      parts.forEach((part, _) => {
        if (part.trim()) {
          pages.push(part.trim());
        }
      });

      return pages.length > 0 ? pages : [html];
    } else {
      return [html];
    }
  }, []);

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
  }, [markdown, previewTheme, getProcessedHTML, splitContentByPages, setTotalPages, setCurrentPage]);

  const pageContents = processedHTML ? splitContentByPages(processedHTML) : [''];

  return {
    processedHTML,
    pageContents,
    currentPage,
    totalPages,
    setCurrentPage
  };
};
