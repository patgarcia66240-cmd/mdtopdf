import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PDFOptions, Template, RecentFile } from '@/types/app';

export class PDFService {
  async generatePDF(markdown: string, options: PDFOptions): Promise<Blob> {
    // Convertir markdown en HTML (implémentation simplifiée pour l'instant)
    const html = await this.convertMarkdownToHTML(markdown, options);

    // Créer un élément temporaire
    const element = document.createElement('div');
    element.innerHTML = html;
    element.style.width = '800px';
    element.style.fontFamily = options.fontFamily;
    element.style.fontSize = `${options.fontSize}px`;
    element.style.padding = `${options.margins.top}px ${options.margins.right}px ${options.margins.bottom}px ${options.margins.left}px`;
    document.body.appendChild(element);

    try {
      // Convertir en canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      // Générer le PDF
      const pdf = new jsPDF({
        orientation: options.orientation,
        unit: 'mm',
        format: options.format,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = options.format === 'a4' ? 210 : 216; // mm
      const pageHeight = options.format === 'a4' ? 297 : 279; // mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      return pdf.output('blob');
    } finally {
      document.body.removeChild(element);
    }
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

  private async convertMarkdownToHTML(markdown: string, options: PDFOptions): Promise<string> {
    // Implémentation basique - à remplacer par react-markdown server-side rendering
    const html = markdown
      .replace(/^# (.*$)/gim, '<h1 style="font-size: 2em; margin: 0.67em 0;">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 style="font-size: 1.5em; margin: 0.75em 0;">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 style="font-size: 1.17em; margin: 0.83em 0;">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/^\* (.*)$/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.*)$/gm, '<p>$1</p>');

    return `<div style="font-family: ${options.fontFamily}; font-size: ${options.fontSize}px; line-height: 1.6;">${html}</div>`;
  }
}

export const pdfService = new PDFService();