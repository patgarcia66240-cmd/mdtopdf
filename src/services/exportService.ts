import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { PDFOptions, Template } from '@/types/app';
import { pdfService } from './pdfService';

export type ExportFormat = 'pdf' | 'docx' | 'html' | 'png';

export interface ExportOptions {
  format: ExportFormat;
  filename: string;
  markdown: string;
  pdfOptions?: PDFOptions;
  template?: Template;
  previewHTML?: string; // Ajout du preview HTML pour l'export HTML
}

export class ExportService {
  async exportDocument(options: ExportOptions): Promise<void> {
    switch (options.format) {
      case 'pdf':
        await this.exportToPDF(options);
        break;
      case 'docx':
        await this.exportToDOCX(options);
        break;
      case 'html':
        await this.exportToHTML(options);
        break;
      case 'png':
        await this.exportToPNG(options);
        break;
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  private async exportToPDF(options: ExportOptions): Promise<void> {
    if (!options.pdfOptions) {
      throw new Error('PDF options are required for PDF export');
    }

    const blob = await pdfService.generatePDF(options.markdown, options.pdfOptions);
    saveAs(blob, `${options.filename}.pdf`);
  }

  private async exportToDOCX(options: ExportOptions): Promise<void> {
    const parsedContent = this.parseMarkdownToDocumentContent(options.markdown);

    const doc = new Document({
      sections: [{
        properties: {},
        children: parsedContent,
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    const uint8Array = new Uint8Array(buffer);
    const blob = new Blob([uint8Array], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    saveAs(blob, `${options.filename}.docx`);
  }

  private async exportToHTML(options: ExportOptions): Promise<void> {
    // Toujours utiliser le preview HTML pour l'export
    await this.exportPreviewHTML(options);
  }

  private async exportPreviewHTML(options: ExportOptions): Promise<void> {
    if (!options.previewHTML) {
      throw new Error('Preview HTML is required for preview HTML export');
    }

    const multiPageHTML = this.generateMultiPageHTMLFromPreview(options.previewHTML, options.filename);
    const blob = new Blob([multiPageHTML], { type: 'text/html;charset=utf-8' });
    saveAs(blob, `${options.filename}.html`);
  }
  private generateMultiPageHTMLFromPreview(htmlContent: string, fileName: string): string {
    const pageTitle = fileName || "Document";

    // Extraire les pages du contenu HTML
    console.log('Recherche des pages dans le contenu HTML...');
    console.log('HTML contient class="page"?', htmlContent.includes('class="page"'));
    console.log('HTML reçu (premiers 500 caractères):', htmlContent.substring(0, 500));

    // D'abord essayer de trouver les conteneurs de pages
    const pageContainers = htmlContent.match(/<div[^>]*class="[^"]*page[^"]*"[^>]*>[\s\S]*?<\/div>/gi);
    console.log('PageContainers trouvés:', pageContainers?.length || 0);
    if (pageContainers && pageContainers.length > 0) {
      console.log('Premier conteneur trouvé:', pageContainers[0].substring(0, 200) + '...');
    }
    let pages: string[] = [];

    if (pageContainers && pageContainers.length > 0) {
      console.log(`Trouvé ${pageContainers.length} conteneurs de pages`);
      pages = pageContainers.map((pageContainer, index) => {
        // Extraire seulement le contenu principal de la page (sans le conteneur page)
        // Garder tout le HTML à l'intérieur du conteneur page
        const contentMatch = pageContainer.match(/<div[^>]*class="[^"]*page[^"]*"[^>]*>([\s\S]*?)<\/div>$/);
        if (contentMatch && contentMatch[1]) {
          const extractedContent = contentMatch[1].trim();
          console.log(`Page ${index + 1} - contenu extrait:`, extractedContent.substring(0, 100) + '...');
          return extractedContent;
        }
        console.log(`Page ${index + 1} - fallback au conteneur complet`);
        return pageContainer.trim();
      });
    } else {
      // Pas de conteneurs de pages trouvés - créer une seule page avec tout le contenu
      console.log('Pas de conteneurs de pages trouvés, création d\'une seule page');
      pages = [htmlContent];
    }

    // Nettoyer les pages vides
    pages = pages.filter(page => page.trim().length > 0);
    console.log(`Nombre de pages après nettoyage: ${pages.length}`);

    const htmlHeader = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <style>
        @page {
            size: A4;
            margin: 20mm;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            margin: 0;
            padding: 20px;
            background: #ffffff;
        }

        .page {
            width: 210mm;
            min-height: 297mm;
            background: white;
            margin: 0 auto 20px auto;
            padding: 20mm;
            border: 1px solid #e2e8f0;
            box-sizing: border-box;
            page-break-after: always;
            position: relative;
        }

        .page:last-child {
            page-break-after: avoid;
            margin-bottom: 0;
        }

        .page-header {
            position: absolute;
            top: 10mm;
            left: 20mm;
            right: 20mm;
            height: 15mm;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            color: #64748b;
            font-weight: 600;
        }

        .page-content {
            margin-top: 30mm;
            margin-bottom: 20mm;
        }

        .page-footer {
            position: absolute;
            bottom: 10mm;
            left: 20mm;
            right: 20mm;
            height: 10mm;
            border-top: 1px solid #e2e8f0;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 11px;
            color: #94a3b8;
        }

        h1, h2, h3, h4, h5, h6 {
            color: #1e293b;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
        }

        h1 { font-size: 20px; font-weight: 700; }
        h2 { font-size: 16px; font-weight: 600; }
        h3 { font-size: 14px; font-weight: 600; }
        h4 { font-size: 13px; font-weight: 600; }

        p {
            margin-bottom: 1em;
            font-size: 11px;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
        }

        th, td {
            border: 1px solid #e2e8f0;
            padding: 6px 8px;
            text-align: left;
            font-size: 10px;
        }

        th {
            background-color: #f8fafc;
            font-weight: 600;
        }

        code {
            background-color: #f1f5f9;
            padding: 2px 4px;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 10px;
        }

        pre {
            background-color: #f1f5f9;
            padding: 12px;
            border-radius: 8px;
            overflow-x: auto;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 9px;
        }

        blockquote {
            border-left: 4px solid #6b7280;
            padding-left: 16px;
            margin: 1em 0;
            color: #64748b;
            font-style: italic;
        }

        ul, ol {
            margin: 1em 0;
            padding-left: 20px;
            font-size: 11px;
        }

        a {
            color: #6b7280;
            text-decoration: none;
            border-bottom: 1px solid #6b7280;
        }

        a:hover {
            color: #4b5563;
            border-bottom-color: #4b5563;
        }

        img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 1em 0;
        }

        @media print {
            body {
                padding: 0;
                background: white;
            }
            .page {
                margin: 0;
                border: none;
                box-shadow: none;
            }
        }
    </style>
</head>
<body>`;

    const htmlFooter = `
</body>
</html>`;

    let pagesHTML = '';

    pages.forEach((pageContent, index) => {
      const pageNumber = index + 1;
      const cleanContent = pageContent.trim();

      if (cleanContent) {
        pagesHTML += `
    <div class="page">
        <div class="page-header">
            Page ${pageNumber}
        </div>
        <div class="page-content">
            ${cleanContent}
        </div>
        <div class="page-footer">
            ${pageTitle} - Page ${pageNumber}
        </div>
    </div>`;
      }
    });

    // Si aucune page valide, créer une page vide
    if (!pagesHTML) {
      pagesHTML = `
    <div class="page">
        <div class="page-header">
            Page 1
        </div>
        <div class="page-content">
            <p>Contenu vide</p>
        </div>
        <div class="page-footer">
            ${pageTitle} - Page 1
        </div>
    </div>`;
    }

    return htmlHeader + pagesHTML + htmlFooter;
  }

  private async exportToPNG(options: ExportOptions): Promise<void> {
    if (!options.pdfOptions) {
      throw new Error('PDF options are required for PNG export');
    }

    // Pour l'instant, on utilise html2canvas pour créer une image
    const htmlContent = await this.generateStyledHTML(options.markdown, options.template);

    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlContent;
    tempElement.style.position = 'absolute';
    tempElement.style.left = '-9999px';
    tempElement.style.width = '800px';
    tempElement.style.backgroundColor = 'white';
    document.body.appendChild(tempElement);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(tempElement, {
        scale: 2,
        backgroundColor: '#ffffff',
      });

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${options.filename}.png`);
        }
      }, 'image/png');
    } finally {
      document.body.removeChild(tempElement);
    }
  }

  private parseMarkdownToDocumentContent(markdown: string): Paragraph[] {
    const lines = markdown.split('\n');
    const paragraphs: Paragraph[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (!trimmedLine) {
        paragraphs.push(new Paragraph({ text: '' }));
        continue;
      }

      // Headers
      if (trimmedLine.startsWith('# ')) {
        paragraphs.push(new Paragraph({
          text: trimmedLine.substring(2),
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
        }));
      } else if (trimmedLine.startsWith('## ')) {
        paragraphs.push(new Paragraph({
          text: trimmedLine.substring(3),
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 150 },
        }));
      } else if (trimmedLine.startsWith('### ')) {
        paragraphs.push(new Paragraph({
          text: trimmedLine.substring(4),
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 100 },
        }));
      }
      // Bold text
      else if (trimmedLine.includes('**')) {
        const parts = trimmedLine.split('**');
        const runs: TextRun[] = [];

        for (let i = 0; i < parts.length; i++) {
          if (i % 2 === 1) {
            runs.push(new TextRun({ text: parts[i], bold: true }));
          } else if (parts[i]) {
            runs.push(new TextRun({ text: parts[i] }));
          }
        }

        paragraphs.push(new Paragraph({
          children: runs,
          spacing: { after: 100 },
        }));
      }
      // Italic text
      else if (trimmedLine.includes('*')) {
        const parts = trimmedLine.split('*');
        const runs: TextRun[] = [];

        for (let i = 0; i < parts.length; i++) {
          if (i % 2 === 1) {
            runs.push(new TextRun({ text: parts[i], italics: true }));
          } else if (parts[i]) {
            runs.push(new TextRun({ text: parts[i] }));
          }
        }

        paragraphs.push(new Paragraph({
          children: runs,
          spacing: { after: 100 },
        }));
      }
      // List items
      else if (trimmedLine.startsWith('- ')) {
        paragraphs.push(new Paragraph({
          text: trimmedLine.substring(2),
          bullet: { level: 0 },
          spacing: { after: 50 },
        }));
      }
      // Regular paragraph
      else {
        paragraphs.push(new Paragraph({
          text: trimmedLine,
          spacing: { after: 100 },
        }));
      }
    }

    return paragraphs;
  }

  private async generateStyledHTML(markdown: string, template?: Template): Promise<string> {
    const styles = template?.styles || {
      fontFamily: 'Inter',
      fontSize: 12,
      lineHeight: 1.6,
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        text: '#1e293b',
        background: '#ffffff',
      },
    };

    // Convertir markdown en HTML basique
    let html = markdown
      .replace(/^# (.*$)/gim, '<h1 style="color: ' + styles.colors.primary + '; font-size: 2em; margin-bottom: 16px;">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 style="color: ' + styles.colors.secondary + '; font-size: 1.5em; margin-bottom: 12px;">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 style="color: ' + styles.colors.text + '; font-size: 1.2em; margin-bottom: 8px;">$1</h3>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/^\* (.*)$/gim, '<li style="margin-bottom: 4px;">$1</li>')
      .replace(/(<li>.*<\/li>)/gims, '<ul style="margin-left: 20px; margin-bottom: 12px;">$1</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.*)$/gm, '<p>$1</p>');

    // Nettoyer les paragraphes vides
    html = html.replace(/<p><\/p>/g, '').replace(/<p>(<h[1-6]>)/g, '$1').replace(/(<\/h[1-6]>)<\/p>/g, '$1');

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document Export</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        body {
            font-family: '${styles.fontFamily}', Arial, sans-serif;
            font-size: ${styles.fontSize}px;
            line-height: ${styles.lineHeight};
            color: ${styles.colors.text};
            background-color: ${styles.colors.background};
            margin: 0;
            padding: 20px;
            margin: 0 auto;
        }

        h1, h2, h3, h4, h5, h6 {
            font-weight: 600;
            margin-top: 0;
            margin-bottom: 16px;
        }

        h1 { font-size: 2em; color: ${styles.colors.primary}; }
        h2 { font-size: 1.5em; color: ${styles.colors.secondary}; }
        h3 { font-size: 1.2em; }

        p {
            margin-bottom: 12px;
            text-align: justify;
        }

        ul, ol {
            margin: 0 0 12px 20px;
            padding-left: 20px;
        }

        li {
            margin-bottom: 4px;
        }

        strong {
            font-weight: 600;
        }

        em {
            font-style: italic;
        }

        blockquote {
            border-left: 4px solid ${styles.colors.primary};
            margin: 0 0 12px 0;
            padding-left: 16px;
            font-style: italic;
            color: ${styles.colors.secondary};
        }

        code {
            background-color: #f3f4f6;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }

        pre {
            background-color: #f3f4f6;
            padding: 12px;
            border-radius: 6px;
            overflow-x: auto;
            margin-bottom: 12px;
        }

        pre code {
            background: none;
            padding: 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
        }

        th, td {
            border: 1px solid #e5e7eb;
            padding: 8px 12px;
            text-align: left;
        }

        th {
            background-color: #f9fafb;
            font-weight: 600;
        }

        a {
            color: ${styles.colors.primary};
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        @media print {
            body { padding: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    ${html}
</body>
</html>`;
  }

  /**
   * Obtenir les formats d'export supportés
   */
  getSupportedFormats(): { value: ExportFormat; label: string; description: string; icon?: string }[] {
    return [
      {
        value: 'pdf',
        label: 'PDF',
        description: 'Format universel pour partage et impression',
        icon: '📄',
      },
      {
        value: 'docx',
        label: 'Word (DOCX)',
        description: 'Document Microsoft Word éditable',
        icon: '📝',
      },
      {
        value: 'html',
        label: 'HTML',
        description: 'Page web interactive avec styles',
        icon: '🌐',
      },
      {
        value: 'png',
        label: 'Image (PNG)',
        description: 'Image haute qualité pour partage',
        icon: '🖼️',
      },
    ];
  }

  /**
   * Valider les options d'export
   */
  validateExportOptions(options: ExportOptions): string[] {
    const errors: string[] = [];

    if (!options.markdown.trim()) {
      errors.push('Le contenu Markdown ne peut pas être vide');
    }

    if (!options.filename.trim()) {
      errors.push('Le nom du fichier ne peut pas être vide');
    }

    if (options.format === 'pdf' && !options.pdfOptions) {
      errors.push('Les options PDF sont requises pour l\'export PDF');
    }

    // Validation du nom de fichier
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(options.filename)) {
      errors.push('Le nom du fichier contient des caractères invalides');
    }

    return errors;
  }
}

export const exportService = new ExportService();