import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
// import htmlToDocx from 'html-to-docx'; // Désactivé pour problèmes de compatibilité navigateur
import { saveAs } from 'file-saver';

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'html' | 'png' | 'jpg' | 'md';
  quality?: 'low' | 'medium' | 'high';
  filename: string;
  template?: string;
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
  };
  pdfOptions?: {
    format?: 'a4' | 'a3' | 'letter';
    orientation?: 'portrait' | 'landscape';
    margins?: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    fontSize?: number;
    fontFamily?: string;
  };
  imageOptions?: {
    width?: number;
    height?: number;
    scale?: number;
    backgroundColor?: string;
  };
}

export interface ExportProgress {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  stage: string;
  startTime: number;
  estimatedTime?: number;
}

class AdvancedExportService {
  private static instance: AdvancedExportService;
  private activeExports: Map<string, ExportProgress> = new Map();

  static getInstance(): AdvancedExportService {
    if (!AdvancedExportService.instance) {
      AdvancedExportService.instance = new AdvancedExportService();
    }
    return AdvancedExportService.instance;
  }

  /**
   * Export unifié pour tous les formats
   */
  async export(
    markdown: string,
    elementRef: HTMLElement | null | undefined,
    options: ExportOptions,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<void> {
    const exportId = this.generateExportId();
    const progress: ExportProgress = {
      id: exportId,
      status: 'pending',
      progress: 0,
      stage: 'Préparation',
      startTime: Date.now()
    };

    this.activeExports.set(exportId, progress);
    onProgress?.(progress);

    try {
      switch (options.format) {
        case 'pdf':
          await this.exportPDF(markdown, elementRef, options, exportId, onProgress);
          break;
        case 'docx':
          await this.exportDOCX(markdown, options, exportId, onProgress);
          break;
        case 'html':
          await this.exportHTML(markdown, options, exportId, onProgress);
          break;
        case 'png':
          await this.exportImage(markdown, elementRef, options, 'png', exportId, onProgress);
          break;
        case 'jpg':
          await this.exportImage(markdown, elementRef, options, 'jpg', exportId, onProgress);
          break;
        case 'md':
          await this.exportMarkdown(markdown, options, exportId, onProgress);
          break;
        default:
          throw new Error(`Format d'export non supporté: ${options.format}`);
      }

      // Mettre à jour le statut final
      const finalProgress = this.activeExports.get(exportId);
      if (finalProgress) {
        finalProgress.status = 'completed';
        finalProgress.progress = 100;
        finalProgress.stage = 'Terminé';
        onProgress?.(finalProgress);
      }

    } catch (error) {
      const errorProgress = this.activeExports.get(exportId);
      if (errorProgress) {
        errorProgress.status = 'error';
        errorProgress.stage = `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`;
        onProgress?.(errorProgress);
      }
      throw error;
    } finally {
      // Nettoyer après un délai
      setTimeout(() => {
        this.activeExports.delete(exportId);
      }, 5000);
    }
  }

  /**
   * Export PDF avec options avancées
   */
  private async exportPDF(
    markdown: string,
    elementRef: HTMLElement | null | undefined,
    options: ExportOptions,
    exportId: string,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<void> {
    this.updateProgress(exportId, 10, 'Génération HTML');

    const html = DOMPurify.sanitize(marked(markdown) as string);

    this.updateProgress(exportId, 30, 'Conversion PDF');

    const pdfOptions = options.pdfOptions || {};
    const pdf = new jsPDF({
      orientation: pdfOptions.orientation || 'portrait',
      unit: 'mm',
      format: pdfOptions.format || 'a4'
    });

    // Configuration des marges
    const margins = pdfOptions.margins || { top: 20, right: 20, bottom: 20, left: 20 };
    const pageWidth = pdf.internal.pageSize.getWidth() - margins.left - margins.right;
    const pageHeight = pdf.internal.pageSize.getHeight() - margins.top - margins.bottom;

    this.updateProgress(exportId, 50, 'Ajout du contenu');

    if (elementRef) {
      // Utiliser html2canvas pour le rendu visuel
      const canvas = await html2canvas(elementRef, {
        scale: options.quality === 'high' ? 2 : options.quality === 'medium' ? 1.5 : 1,
        useCORS: true,
        allowTaint: true
      });

      this.updateProgress(exportId, 80, 'Finalisation PDF');

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margins.top;

      pdf.addImage(imgData, 'PNG', margins.left, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + margins.top;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margins.left, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
    } else {
      // Utiliser le texte directement
      const fontSize = pdfOptions.fontSize || 12;
      const fontFamily = pdfOptions.fontFamily || 'helvetica';

      pdf.setFontSize(fontSize);
      pdf.setFont(fontFamily);

      const lines = pdf.splitTextToSize(markdown, pageWidth);
      let y = margins.top;

      lines.forEach((line: string) => {
        if (y > pageHeight + margins.top) {
          pdf.addPage();
          y = margins.top;
        }
        pdf.text(line, margins.left, y);
        y += fontSize * 0.5;
      });
    }

    // Ajouter les métadonnées
    if (options.metadata) {
      pdf.setProperties({
        title: options.metadata.title || options.filename,
        author: options.metadata.author || '',
        subject: options.metadata.subject || '',
        keywords: options.metadata.keywords || ''
      });
    }

    this.updateProgress(exportId, 100, 'Sauvegarde PDF');
    pdf.save(`${options.filename}.pdf`);
  }

  /**
   * Export DOCX (temporairement désactivé - utilise HTML à la place)
   */
  private async exportDOCX(
    markdown: string,
    options: ExportOptions,
    exportId: string,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<void> {
    // Pour l'instant, on exporte en HTML formaté avec extension .docx
    // html-to-docx a des problèmes de compatibilité navigateur
    this.updateProgress(exportId, 20, 'Conversion Markdown vers HTML');

    const html = marked(markdown) as string;

    this.updateProgress(exportId, 50, 'Génération DOCX (format HTML)');

    // Créer le HTML avec les styles
    const styledHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
          h1, h2, h3, h4, h5, h6 { color: #333; margin-top: 20px; }
          p { margin: 10px 0; }
          code { background-color: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
          pre { background-color: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
          blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 20px; color: #666; }
          table { border-collapse: collapse; width: 100%; margin: 10px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        ${DOMPurify.sanitize(html)}
      </body>
      </html>
    `;

    this.updateProgress(exportId, 100, 'Sauvegarde DOCX (format HTML)');

    // Exporter en HTML avec extension .docx (solution temporaire)
    const blob = new Blob([styledHtml], { type: 'text/html;charset=utf-8' });
    saveAs(blob, `${options.filename}.docx`);
  }

  /**
   * Export HTML avec styles intégrés
   */
  private async exportHTML(
    markdown: string,
    options: ExportOptions,
    exportId: string,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<void> {
    this.updateProgress(exportId, 30, 'Conversion Markdown vers HTML');

    const html = marked(markdown) as string;

    this.updateProgress(exportId, 60, 'Génération HTML stylisé');

    // Créer un HTML complet avec styles CSS intégrés
    const styledHtml = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${options.metadata?.title || options.filename}</title>
        <style>
          * {
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background-color: #fff;
          }
          h1, h2, h3, h4, h5, h6 {
            color: #2c3e50;
            margin-top: 2em;
            margin-bottom: 1em;
            font-weight: 600;
          }
          h1 { font-size: 2.5em; border-bottom: 2px solid #eee; padding-bottom: 10px; }
          h2 { font-size: 2em; border-bottom: 1px solid #eee; padding-bottom: 8px; }
          h3 { font-size: 1.5em; }
          h4 { font-size: 1.25em; }
          h5 { font-size: 1.1em; }
          h6 { font-size: 1em; }
          p {
            margin: 1em 0;
            text-align: justify;
          }
          a {
            color: #3498db;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          strong, b {
            font-weight: 600;
            color: #2c3e50;
          }
          em, i {
            font-style: italic;
          }
          code {
            background-color: #f8f9fa;
            padding: 0.2em 0.4em;
            margin: 0;
            font-size: 85%;
            border-radius: 3px;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            color: #e83e8c;
          }
          pre {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 4px;
            padding: 16px;
            overflow: auto;
            font-size: 85%;
            line-height: 1.45;
          }
          pre code {
            background-color: transparent;
            padding: 0;
            color: inherit;
          }
          blockquote {
            border-left: 4px solid #3498db;
            margin: 1.5em 0;
            padding: 0.5em 1.5em;
            background-color: #f8f9fa;
            color: #6c757d;
          }
          ul, ol {
            padding-left: 2em;
            margin: 1em 0;
          }
          li {
            margin: 0.5em 0;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 1.5em 0;
            font-size: 0.95em;
          }
          th, td {
            border: 1px solid #dee2e6;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f8f9fa;
            font-weight: 600;
          }
          tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          hr {
            border: none;
            border-top: 1px solid #dee2e6;
            margin: 2em 0;
          }
          img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          @media print {
            body { padding: 0; }
            h1, h2 { page-break-after: avoid; }
            pre, blockquote { page-break-inside: avoid; }
            img { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        ${DOMPurify.sanitize(html)}
      </body>
      </html>
    `;

    this.updateProgress(exportId, 100, 'Sauvegarde HTML');

    // Créer et télécharger le fichier
    const blob = new Blob([styledHtml], { type: 'text/html;charset=utf-8' });
    saveAs(blob, `${options.filename}.html`);
  }

  /**
   * Export d'images (PNG/JPG)
   */
  private async exportImage(
    markdown: string,
    elementRef: HTMLElement | null | undefined,
    options: ExportOptions,
    format: 'png' | 'jpg',
    exportId: string,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<void> {
    if (!elementRef) {
      throw new Error('L\'export d\'images nécessite un élément DOM de référence');
    }

    this.updateProgress(exportId, 20, 'Préparation du rendu');

    const imageOptions = options.imageOptions || {};
    const scale = imageOptions.scale || (options.quality === 'high' ? 2 : options.quality === 'medium' ? 1.5 : 1);

    this.updateProgress(exportId, 50, 'Génération de l\'image');

    const canvas = await html2canvas(elementRef, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: imageOptions.backgroundColor || '#ffffff',
      width: imageOptions.width,
      height: imageOptions.height,
      logging: false
    });

    this.updateProgress(exportId, 80, 'Conversion d\'image');

    // Convertir vers le format demandé
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const dataUrl = canvas.toDataURL(mimeType, options.quality === 'high' ? 0.95 : options.quality === 'medium' ? 0.85 : 0.75);

    this.updateProgress(exportId, 100, 'Sauvegarde de l\'image');

    // Télécharger l'image
    const link = document.createElement('a');
    link.download = `${options.filename}.${format}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Export Markdown brut
   */
  private async exportMarkdown(
    markdown: string,
    options: ExportOptions,
    exportId: string,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<void> {
    this.updateProgress(exportId, 50, 'Préparation du fichier');

    // Ajouter des métadonnées en en-tête
    let content = '';
    if (options.metadata) {
      content += '---\n';
      content += `title: ${options.metadata.title || options.filename}\n`;
      if (options.metadata.author) content += `author: ${options.metadata.author}\n`;
      if (options.metadata.subject) content += `subject: ${options.metadata.subject}\n`;
      if (options.metadata.keywords) content += `keywords: ${options.metadata.keywords}\n`;
      content += '---\n\n';
    }
    content += markdown;

    this.updateProgress(exportId, 100, 'Sauvegarde Markdown');

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, `${options.filename}.md`);
  }

  /**
   * Mettre à jour la progression d'un export
   */
  private updateProgress(exportId: string, progress: number, stage: string): void {
    const exportProgress = this.activeExports.get(exportId);
    if (exportProgress) {
      exportProgress.progress = progress;
      exportProgress.stage = stage;

      // Calculer le temps estimé restant
      const elapsed = Date.now() - exportProgress.startTime;
      if (progress > 0) {
        const totalTime = (elapsed / progress) * 100;
        exportProgress.estimatedTime = Math.max(0, Math.round((totalTime - elapsed) / 1000));
      }
    }
  }

  /**
   * Générer un ID d'export unique
   */
  private generateExportId(): string {
    return `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Obtenir la progression d'un export
   */
  getExportProgress(exportId: string): ExportProgress | undefined {
    return this.activeExports.get(exportId);
  }

  /**
   * Obtenir tous les exports actifs
   */
  getActiveExports(): ExportProgress[] {
    return Array.from(this.activeExports.values());
  }

  /**
   * Annuler un export
   */
  cancelExport(exportId: string): boolean {
    const exportProgress = this.activeExports.get(exportId);
    if (exportProgress && exportProgress.status === 'processing') {
      exportProgress.status = 'error';
      exportProgress.stage = 'Export annulé';
      return true;
    }
    return false;
  }
}

export default AdvancedExportService;
