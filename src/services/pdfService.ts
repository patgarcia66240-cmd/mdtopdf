import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PDFOptions, Template, RecentFile } from '@/types/app';

export class PDFService {
  async generatePDF(markdown: string, options: PDFOptions): Promise<Blob> {
    // Importer marked pour la conversion markdown
    const { marked } = await import('marked');

    // Traiter les sauts de page AVANT la conversion markdown
    let processedMarkdown = markdown;

    // Détecter les marqueurs de page explicites avant la conversion markdown
    processedMarkdown = processedMarkdown.replace(/<!--\s*pagebreak\s*-->|<!--\s*newpage\s*-->/gi, '\n<!--PAGEBREAK-->\n');
    processedMarkdown = processedMarkdown.replace(/\\pagebreak|\\newpage/gi, '\n<!--PAGEBREAK-->\n');
    processedMarkdown = processedMarkdown.replace(/^---?\s*page\s*break\s*---?$/gmi, '\n<!--PAGEBREAK-->\n');
    processedMarkdown = processedMarkdown.replace(/^\[pagebreak\]$/gmi, '\n<!--PAGEBREAK-->\n');
    processedMarkdown = processedMarkdown.replace(/^---\s*PAGE\s*\d+\s*---$/gmi, '\n<!--PAGEBREAK-->\n');

    // Configuration de marked
    const markedOptions = {
      breaks: true,
      gfm: true,
      sanitize: false,
      pedantic: false,
      smartLists: true,
      smartypants: false,
      mangle: false,
      headerIds: false
    };

    let html = await marked(processedMarkdown, markedOptions);

    // Détecter les titres de page après conversion markdown (ex: <h2>Page 1</h2>, <h3>Page 2</h2>, etc.)
    html = html.replace(/<h([1-6])[^>]*>\s*page\s*\d+\s*<\/h\1>/gi, '<div style="page-break-before: always; clear: both;"></div>');
    html = html.replace(/<h([1-6])[^>]*>\s*Page\s*\d+\s*<\/h\1>/gi, '<div style="page-break-before: always; clear: both;"></div>');
    html = html.replace(/<h([1-6])[^>]*>\s*PAGE\s*\d+\s*<\/h\1>/gi, '<div style="page-break-before: always; clear: both;"></div>');

    // Remplacer les marqueurs de saut de page par des divs avec style CSS
    html = html.replace(/<!--PAGEBREAK-->/gi, '<div style="page-break-before: always; clear: both;"></div>');

    // Améliorer le style HTML avec les options
    html = this.enhanceHTMLWithStyles(html, options);

    // Diviser le contenu en pages selon les sauts de page
    const pages = this.splitContentIntoPages(html);

    // Générer le PDF avec plusieurs pages
    return await this.generateMultiPagePDF(pages, options);
  }

  private splitContentIntoPages(html: string): string[] {
    // Chercher les divs de saut de page
    const pageBreakPattern = /<div[^>]*style="[^"]*page-break-before:\s*always[^"]*"[^>]*><\/div>/gi;
    const hasPageBreaks = pageBreakPattern.test(html);

    if (hasPageBreaks) {
      // Utiliser les sauts de page explicites
      const parts = html.split(pageBreakPattern);
      const pages: string[] = [];

      parts.forEach((part, index) => {
        const cleanPart = part.trim();
        if (cleanPart) {
          pages.push(cleanPart);
        }
      });

      // Si on n'a pas trouvé de contenu valide, retourner le HTML complet
      if (pages.length === 0) {
        return [html];
      }

      return pages;
    } else {
      // Si pas de sauts de page explicites, retourner une seule page
      return [html];
    }
  }

  private async generateMultiPagePDF(pages: string[], options: PDFOptions): Promise<Blob> {
    const pdf = new jsPDF({
      orientation: options.orientation,
      unit: 'mm',
      format: options.format,
    });

    // Dimensions pour A4 avec marges ajustées
    const pageWidth = options.format === 'a4' ? 210 : 216; // mm
    const pageHeight = options.format === 'a4' ? 297 : 279; // mm
    const marginLeft = 20; // marge gauche en mm
    const marginRight = 20; // marge droite en mm
    const marginTop = 0; // marge haut en mm
    const marginBottom = 30; // marge bas en mm pour éviter le texte sous le footer
    const contentWidth = pageWidth - (marginLeft + marginRight);
    const contentHeight = pageHeight - (marginTop + marginBottom);

    for (let i = 0; i < pages.length; i++) {
      if (i > 0) {
        pdf.addPage();
      }

      // Créer un conteneur principal pour la page avec dimensions A4 exactes
      const pageContainer = document.createElement('div');
      pageContainer.style.position = 'relative';
      pageContainer.style.width = '794px'; // Exactement 210mm A4 à 96dpi
      pageContainer.style.height = '1123px'; // Exactement 297mm A4 à 96dpi
      pageContainer.style.backgroundColor = '#ffffff';

      // Créer le conteneur de contenu - utiliser les mêmes marges que l'aperçu
      const contentElement = document.createElement('div');
      contentElement.innerHTML = pages[i];
      contentElement.style.position = 'absolute';
      contentElement.style.top = '0';
      contentElement.style.left = '0';
      contentElement.style.right = '0';
      contentElement.style.height = '100%'; // Utiliser toute la hauteur - pas de footer
      contentElement.style.fontFamily = options.fontFamily;
      contentElement.style.fontSize = `${options.fontSize}px`;
      contentElement.style.padding = '0px 76px 10px 76px'; // 0mm haut, 20mm côtés, 2.5mm bas, 20mm gauche (en pixels à 96dpi)
      contentElement.style.overflow = 'hidden'; // Couper strictement ce qui dépasse
      contentElement.style.boxSizing = 'border-box';

      // Assembler la page - PAS DE FOOTER pour un rendu propre
      pageContainer.appendChild(contentElement);
      document.body.appendChild(pageContainer);

      const element = pageContainer; // Utiliser le conteneur complet pour le rendu

      try {
        // Convertir cette page en canvas
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');

        // Calculer les dimensions pour que le contenu tienne sur la page
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Si l'image est trop grande pour la page, la réduire
        let finalWidth = imgWidth;
        let finalHeight = imgHeight;
        let yPosition = marginTop;

        if (imgHeight > contentHeight) {
          finalHeight = contentHeight;
          finalWidth = (canvas.width * finalHeight) / canvas.height;
          yPosition = marginTop + (contentHeight - finalHeight) / 2; // Centrer verticalement
        }

        const xPosition = marginLeft + (contentWidth - finalWidth) / 2; // Centrer horizontalement

        pdf.addImage(imgData, 'PNG', xPosition, yPosition, finalWidth, finalHeight);
      } finally {
        document.body.removeChild(element);
      }
    }

    return pdf.output('blob');
  }

  async generatePDFPreview(markdown: string, options: PDFOptions): Promise<string> {
    const blob = await this.generatePDF(markdown, options);
    return URL.createObjectURL(blob);
  }

  async getTemplates(): Promise<Template[]> {
    // Retourner les templates par défaut + templates utilisateur depuis localStorage
    const defaultTemplates: Template[] = [
      {
        id: 'modern',
        name: 'Modern',
        description: 'Template moderne et épuré',
        category: 'professional',
        styles: {
          fontFamily: 'Inter',
          fontSize: 12,
          lineHeight: 1.6,
          colors: {
            primary: '#2563eb',
            secondary: '#64748b',
            text: '#1e293b',
            background: '#ffffff',
          },
        },
        layout: {
          margins: { top: 20, right: 20, bottom: 20, left: 20 },
          pageSize: 'a4',
          orientation: 'portrait',
        },
        preview: '/templates/modern-preview.png',
        colors: ['#2563eb', '#64748b', '#1e293b', '#ffffff'],
        isPro: false,
      },
      {
        id: 'academic',
        name: 'Academic',
        description: 'Template académique formel',
        category: 'academic',
        styles: {
          fontFamily: 'Times New Roman',
          fontSize: 12,
          lineHeight: 2,
          colors: {
            primary: '#000000',
            secondary: '#666666',
            text: '#000000',
            background: '#ffffff',
          },
        },
        layout: {
          margins: { top: 25, right: 25, bottom: 25, left: 25 },
          pageSize: 'a4',
          orientation: 'portrait',
        },
        preview: '/templates/academic-preview.png',
        colors: ['#000000', '#666666', '#ffffff'],
        isPro: false,
      },
    ];

    const userTemplates = JSON.parse(localStorage.getItem('user-templates') || '[]');
    return [...defaultTemplates, ...userTemplates];
  }

  async getRecentFiles(): Promise<RecentFile[]> {
    return JSON.parse(localStorage.getItem('recent-files') || '[]');
  }

  async saveRecentFile(file: RecentFile): Promise<void> {
    const recentFiles = await this.getRecentFiles();
    const filtered = recentFiles.filter(f => f.id !== file.id);
    const updated = [file, ...filtered].slice(0, 10); // Garder seulement les 10 plus récents
    localStorage.setItem('recent-files', JSON.stringify(updated));
  }

  private enhanceHTMLWithStyles(html: string, options: PDFOptions): string {
    // Appliquer les styles de base en utilisant les options
    const baseStyles = `
      font-family: ${options.fontFamily || 'Inter'};
      font-size: ${options.fontSize || 12}px;
      line-height: 1.6;
      color: #1e293b;
      margin: 0;
      padding: 0;
    `;

    // Réinitialiser tous les styles CSS pour éviter les marges par défaut
    let enhancedHTML = html
      // Reset CSS agressif pour supprimer toutes les marges
      .replace(/<h1([^>]*)>/g, `<h1$1 style="font-size: 2em; margin: 2px 0 2px 0; font-weight: 700; color: #1e293b; padding: 0;">`)
      .replace(/<h2([^>]*)>/g, `<h2$1 style="font-size: 1.5em; margin: 2px 0 1px 0; font-weight: 600; color: #334155; padding: 0;">`)
      .replace(/<h3([^>]*)>/g, `<h3$1 style="font-size: 1.17em; margin: 1px 0 1px 0; font-weight: 600; color: #475569; padding: 0;">`)
      .replace(/<p([^>]*)>/g, `<p$1 style="margin: 1px 0; text-align: justify; padding: 0;">`)
      .replace(/<strong([^>]*)>/g, `<strong$1 style="font-weight: 700; color: inherit;">`)
      .replace(/<em([^>]*)>/g, `<em$1 style="font-style: italic; color: inherit;">`)
      .replace(/<ul([^>]*)>/g, `<ul$1 style="margin: 0.5em 0; padding-left: 20px;">`)
      .replace(/<ol([^>]*)>/g, `<ol$1 style="margin: 0.5em 0; padding-left: 20px;">`)
      .replace(/<li([^>]*)>/g, `<li$1 style="margin: 0.25em 0;">`)
      .replace(/<blockquote([^>]*)>/g, `<blockquote$1 style="border-left: 2px solid #d1d5db; margin: 1em 0; padding-left: 12px; font-style: italic; color: #6b7280;">`)
      .replace(/<code([^>]*)>/g, `<code$1 style="background-color: #f8fafc; padding: 1px 3px; font-family: 'Courier New', monospace; font-size: 0.9em;">`)
      .replace(/<pre([^>]*)>/g, `<pre$1 style="background-color: #f8fafc; padding: 8px; overflow-x: auto; margin: 1em 0; font-family: 'Courier New', monospace; font-size: 0.85em; line-height: 1.2;">`)
      .replace(/<table([^>]*)>/g, `<table$1 style="width: 100%; margin: 1em 0;">`)
      .replace(/<th([^>]*)>/g, `<th$1 style="padding: 6px 8px; background-color: #f9fafb; font-weight: 600; text-align: left;">`)
      .replace(/<td([^>]*)>/g, `<td$1 style="padding: 6px 8px;">`);

    // Envelopper le contenu dans un div avec les styles de base
    return `<div style="${baseStyles}">${enhancedHTML}</div>`;
  }
}

export const pdfService = new PDFService();
