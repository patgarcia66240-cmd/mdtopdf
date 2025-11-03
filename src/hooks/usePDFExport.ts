import { useState, useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { marked } from 'marked';

export interface PDFOptions {
  format: 'a4' | 'letter' | 'legal';
  orientation: 'portrait' | 'landscape';
  margins: number;
  fontSize: number;
  lineHeight: number;
  header?: string;
  footer?: string;
}

export const usePDFExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const calculatePages = useCallback((element: HTMLElement, options: PDFOptions) => {
    const elementHeight = element.scrollHeight;
    const pageHeight = options.format === 'a4' ? 842 : options.format === 'letter' ? 792 : 1008;
    const availableHeight = pageHeight - (options.margins * 2 * 3.78); // Convert mm to pixels

    return Math.ceil(elementHeight / availableHeight);
  }, []);

  const processHTMLForPDF = useCallback((html: string, _options: PDFOptions): string => {
    let processedHTML = html;

    // Nettoyer les gradients CSS
    processedHTML = processedHTML.replace(
      /background:(.*?gradient.*?;)/gi,
      'background: #ffffff;'
    );

    // Nettoyer les propriétés CSS problématiques
    processedHTML = processedHTML.replace(
      /background-clip:\s*text\s*;?/gi,
      ''
    );

    processedHTML = processedHTML.replace(
      /-webkit-background-clip:\s*text\s*;?/gi,
      ''
    );

    // Remplacer les couleurs de texte transparentes
    processedHTML = processedHTML.replace(
      /color:\s*transparent\s*;?/gi,
      'color: #000000;'
    );

    return processedHTML;
  }, []);

  const exportToPDF = useCallback(async (
    element: HTMLElement,
    fileName: string,
    options: PDFOptions
  ) => {
    setIsExporting(true);

    try {
      console.log('🎨 Traitement des gradients CSS pour le PDF...');
      const originalHTML = element.innerHTML;
      element.innerHTML = processHTMLForPDF(originalHTML, options);

      // Détecter les sauts de page manuels
      const pageBreakElements = element.querySelectorAll('[style*="page-break-before: always"]');
      const hasManualPageBreaks = pageBreakElements.length > 0;

      let totalPages: number;
      if (hasManualPageBreaks) {
        // Si il y a des sauts de page manuels, compter les pages basées sur ces éléments
        totalPages = pageBreakElements.length + 1;
        console.log('📊 Pagination manuelle détectée:', totalPages, 'pages');
      } else {
        // Sinon, utiliser le calcul automatique
        totalPages = calculatePages(element, options);
        console.log('📊 Pagination automatique:', totalPages, 'pages');
      }

      const pdf = new jsPDF({
        orientation: options.orientation,
        unit: 'mm',
        format: options.format
      });

      const marginMm = options.margins;
      const pageWidth = pdf.internal.pageSize.getWidth() - (marginMm * 2);
      const pageHeight = pdf.internal.pageSize.getHeight() - (marginMm * 2);

      if (totalPages === 1) {
        console.log('📄 Document tient sur une seule page');

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const imgHeight = (canvas.height * pageWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', marginMm, marginMm, pageWidth, imgHeight);
      } else if (hasManualPageBreaks) {
        console.log('📄 Génération avec sauts de page manuels');

        // Créer des pages basées sur les sauts de page
        const pageElements: HTMLElement[] = [];
        let currentElement = element.firstElementChild as HTMLElement;

        if (currentElement) {
          let currentPageContent = document.createElement('div');
          currentPageContent.style.cssText = element.style.cssText;

          while (currentElement) {
            const nextElement = currentElement.nextElementSibling as HTMLElement;

            // Vérifier si c'est un saut de page
            if (currentElement.style.pageBreakBefore === 'always' ||
                currentElement.getAttribute('style')?.includes('page-break-before: always')) {
              // Ajouter la page actuelle si elle n'est pas vide
              if (currentPageContent.children.length > 0) {
                pageElements.push(currentPageContent);
              }
              // Créer une nouvelle page
              currentPageContent = document.createElement('div');
              currentPageContent.style.cssText = element.style.cssText;
            } else {
              // Ajouter l'élément à la page actuelle
              currentPageContent.appendChild(currentElement.cloneNode(true));
            }

            currentElement = nextElement;
          }

          // Ajouter la dernière page
          if (currentPageContent.children.length > 0) {
            pageElements.push(currentPageContent);
          }

          // Générer le PDF pour chaque page
          for (let i = 0; i < pageElements.length; i++) {
            if (i > 0) {
              pdf.addPage();
            }

            // Remplacer temporairement le contenu de l'élément
            const tempContent = element.innerHTML;
            element.innerHTML = pageElements[i].innerHTML;

            const canvas = await html2canvas(element, {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const imgHeight = (canvas.height * pageWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', marginMm, marginMm, pageWidth, imgHeight);

            // Restaurer le contenu original
            element.innerHTML = tempContent;
          }
        }
      } else {
        console.log('📄 Génération automatique de', totalPages, 'pages');

        for (let page = 0; page < totalPages; page++) {
          if (page > 0) {
            pdf.addPage();
          }

          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            height: element.scrollHeight / totalPages,
            y: page * (element.scrollHeight / totalPages)
          });

          const imgData = canvas.toDataURL('image/png');
          const imgHeight = (canvas.height * pageWidth) / canvas.width;

          pdf.addImage(imgData, 'PNG', marginMm, marginMm, pageWidth, imgHeight);
        }
      }

      // Ajouter header et footer si spécifiés
      if (options.header || options.footer) {
        const pageCount = pdf.internal.pages.length;
        for (let i = 1; i <= pageCount; i++) {
          pdf.setPage(i);

          if (options.header) {
            pdf.setFontSize(10);
            pdf.setTextColor(100);
            pdf.text(options.header, marginMm, marginMm - 5);
          }

          if (options.footer) {
            pdf.setFontSize(10);
            pdf.setTextColor(100);
            pdf.text(
              options.footer + ` - Page ${i}/${pageCount}`,
              pdf.internal.pageSize.getWidth() - marginMm,
              pdf.internal.pageSize.getHeight() - marginMm + 5,
              { align: 'right' }
            );
          }
        }
      }

      pdf.save(fileName);
      element.innerHTML = originalHTML;

      console.log('📄 PDF sauvegardé avec succès - Format:', options.format.toUpperCase(), 'Marges:', marginMm, 'mm');

    } catch (error) {
      console.error('❌ Erreur lors de l\'export PDF:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, [calculatePages, processHTMLForPDF]);

  const exportToHTML = useCallback((markdown: string, fileName: string) => {
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1, h2, h3 { color: #2563eb; margin-top: 1.5em; }
        h1 { font-size: 2em; }
        h2 { font-size: 1.5em; }
        h3 { font-size: 1.2em; }
        code {
            background-color: #f1f5f9;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
        }
        pre {
            background-color: #f8fafc;
            padding: 16px;
            border-radius: 8px;
            overflow-x: auto;
            font-family: monospace;
        }
        blockquote {
            border-left: 4px solid #e5e7eb;
            padding-left: 16px;
            margin: 16px 0;
            font-style: italic;
            color: #6b7280;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 16px 0;
        }
        th, td {
            border: 1px solid #e5e7eb;
            padding: 8px 12px;
            text-align: left;
        }
        th {
            background-color: #f8fafc;
            font-weight: 600;
        }
    </style>
</head>
<body>
${marked(markdown)}
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const exportToMarkdown = useCallback((markdown: string, fileName: string) => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const exportToDOCX = useCallback((markdown: string, fileName: string) => {
    // Version simplifiée - dans une vraie app, on utiliserait une librairie comme docx
    const html = marked(markdown);
    const docxHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
      <head><title>${fileName}</title></head>
      <body>${html}</body>
      </html>
    `;

    const blob = new Blob([docxHTML], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return {
    exportToPDF,
    exportToHTML,
    exportToMarkdown,
    exportToDOCX,
    isExporting
  };
};
