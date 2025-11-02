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
    const htmlContent = await this.generateStyledHTML(options.markdown, options.template);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    saveAs(blob, `${options.filename}.html`);
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
            max-width: 800px;
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