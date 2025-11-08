import { PDFOptions, Margins, HeaderFooter } from '../types/app';

// Alias pour plus de clarté dans le code
type AppPDFOptions = PDFOptions;

// Types locaux pour ce fichier
interface PDFMetrics {
  pageCount: number;
  estimatedFileSize: number;
  renderTime: number;
  wordCount: number;
  charCount: number;
  lineHeight: number;
  paragraphsCount: number;
}

interface PDFPage {
  content: string;
  pageNumber: number;
  canvas?: HTMLCanvasElement;
  dimensions: {
    width: number;
    height: number;
  };
  margins: Margins;
  header?: HeaderFooter;
  footer?: HeaderFooter;
}

/**
 * Utilitaires pour la génération et manipulation de PDF
 */

// Conversion des formats de page en millimètres
export const PAGE_FORMATS_MM: Record<string, { width: number; height: number }> = {
  a4: { width: 210, height: 297 },
  letter: { width: 216, height: 279 },
  legal: { width: 216, height: 356 },
  a3: { width: 297, height: 420 },
  a5: { width: 148, height: 210 },
};

// Constants pour les calculs PDF
export const POINTS_PER_MM = 2.834645669;
export const MM_PER_POINT = 0.3527777778;
export const DEFAULT_DPI = 96;
export const MM_PER_INCH = 25.4;

/**
 * Calcule les métriques d'un document PDF à partir du contenu
 */
export function calculatePDFMetrics(
  content: string,
  options: AppPDFOptions,
  previewElement?: HTMLElement
): PDFMetrics {
  // Compter les mots et les caractères
  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = content.length;

  // Calculer le nombre de paragraphes
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
  const paragraphsCount = paragraphs.length;

  // Estimer la hauteur de ligne en mm basée sur la taille de la police
  const lineHeightMM = (options.fontSize || 12) * 0.35; // Conversion approximative

  // Obtenir les dimensions de la page
  const pageDimensions = getPageDimensions(options.format || 'a4', options.orientation || 'portrait');

  // Calculer les marges utilisables
  const margins = options.margins || { top: 20, right: 20, bottom: 20, left: 20 };
  const usableWidth = pageDimensions.width - margins.left - margins.right;
  const usableHeight = pageDimensions.height - margins.top - margins.bottom;

  // Estimer le nombre de lignes par page
  const linesPerPage = Math.floor(usableHeight / lineHeightMM);

  // Estimer le nombre de caractères par ligne
  const avgCharWidth = (options.fontSize || 12) * 0.6 * 0.35; // Approximation
  const charsPerLine = Math.floor(usableWidth / avgCharWidth);

  // Estimer le nombre de pages
  const estimatedLines = Math.ceil(charCount / charsPerLine);
  const pageCount = Math.ceil(estimatedLines / linesPerPage);

  // Estimer la taille du fichier (approximation)
  const estimatedFileSize = pageCount * 50000; // ~50KB par page en moyenne

  return {
    pageCount,
    estimatedFileSize,
    renderTime: 0, // Sera rempli après le rendu
    wordCount,
    charCount,
    lineHeight: lineHeightMM,
    paragraphsCount,
  };
}

/**
 * Obtient les dimensions d'une page en millimètres
 */
export function getPageDimensions(
  format: string,
  orientation: 'portrait' | 'landscape' = 'portrait'
): { width: number; height: number } {
  const dimensions = PAGE_FORMATS_MM[format.toLowerCase()] || PAGE_FORMATS_MM.a4;

  if (orientation === 'landscape') {
    return {
      width: dimensions.height,
      height: dimensions.width,
    };
  }

  return dimensions;
}

/**
 * Convertit les pixels en millimètres
 */
export function pixelsToMM(pixels: number, dpi: number = DEFAULT_DPI): number {
  return (pixels * MM_PER_INCH) / dpi;
}

/**
 * Convertit les millimètres en pixels
 */
export function mmToPixels(mm: number, dpi: number = DEFAULT_DPI): number {
  return (mm * dpi) / MM_PER_INCH;
}

/**
 * Calcule l'échelle optimale pour le contenu PDF
 */
export function calculateOptimalScale(
  contentWidth: number,
  contentHeight: number,
  pageWidth: number,
  pageHeight: number,
  margins: { top: number; right: number; bottom: number; left: number }
): number {
  const usableWidth = pageWidth - margins.left - margins.right;
  const usableHeight = pageHeight - margins.top - margins.bottom;

  const scaleX = usableWidth / contentWidth;
  const scaleY = usableHeight / contentHeight;

  // Utiliser l'échelle la plus restrictive pour s'assurer que tout tient dans la page
  return Math.min(scaleX, scaleY, 1); // Ne jamais dépasser 1 (pas d'agrandissement)
}

/**
 * Divise le contenu HTML en pages basées sur les sauts de page
 */
export function splitContentIntoPages(html: string): string[] {
  // Patterns pour les sauts de page
  const pageBreakPatterns = [
    /<div[^>]*style="[^"]*page-break-before:\s*always[^"]*"[^>]*><\/div>/gi,
    /<div[^>]*class="[^"]*page-break[^"]*"[^>]*><\/div>/gi,
    /<!--\s*PAGEBREAK\s*-->/gi,
    /<!--\s*pagebreak\s*-->/gi,
    /<!--\s*newpage\s*-->/gi,
  ];

  // Vérifier s'il y a des sauts de page explicites
  const hasPageBreaks = pageBreakPatterns.some(pattern => pattern.test(html));

  if (hasPageBreaks) {
    // Utiliser les sauts de page explicites
    const parts = html.split(pageBreakPatterns[0]);
    const pages: string[] = [];

    parts.forEach(part => {
      const cleanPart = part.trim();
      if (cleanPart) {
        pages.push(cleanPart);
      }
    });

    return pages.length > 0 ? pages : [html];
  }

  // Si aucun saut de page explicite, retourner le contenu comme une seule page
  return [html];
}

/**
 * Génère un nom de fichier sécurisé
 */
export function generateSafeFileName(baseName: string, extension: string = 'pdf'): string {
  // Supprimer les caractères non valides
  const safeName = baseName
    .replace(/[^a-z0-9àâäéèêëïîôöùûüÿç]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return `${safeName || 'document'}.${extension}`;
}

/**
 * Valide les options PDF
 */
export function validatePDFOptions(options: Partial<AppPDFOptions>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (options.format && !Object.keys(PAGE_FORMATS_MM).includes(options.format)) {
    errors.push(`Format non valide: ${options.format}. Formats supportés: ${Object.keys(PAGE_FORMATS_MM).join(', ')}`);
  }
  // Valider le format


  // Valider l'orientation
  if (options.orientation && !['portrait', 'landscape'].includes(options.orientation)) {
    errors.push(`Orientation non valide: ${options.orientation}. Options: portrait, landscape`);
  }

  // Valider la taille de la police
  if (options.fontSize !== undefined) {
    if (typeof options.fontSize !== 'number' || options.fontSize < 6 || options.fontSize > 72) {
      errors.push('La taille de la police doit être un nombre entre 6 et 72');
    }
  }

  // Valider les marges
  if (options.margins) {
    const { top, right, bottom, left } = options.margins;
    if (top < 0 || right < 0 || bottom < 0 || left < 0) {
      errors.push('Les marges ne peuvent pas être négatives');
    }
    if (top > 50 || right > 50 || bottom > 50 || left > 50) {
      errors.push('Les marges ne devraient pas dépasser 50mm');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calcule le temps de rendu estimé pour un PDF
 */
export function estimateRenderTime(metrics: PDFMetrics): number {
  // Estimation basée sur le nombre de pages et la complexité
  const baseTimePerPage = 1000; // 1 seconde par page
  const complexityFactor = Math.min(metrics.wordCount / 1000, 2); // Facteur jusqu'à 2x
  const imageFactor = 1.2; // 20% de plus s'il y a des images (simplifié)

  return (metrics.pageCount * baseTimePerPage * complexityFactor * imageFactor);
}

/**
 * Optimise les options PDF pour la performance
 */
export function optimizePDFOptions(options: Partial<AppPDFOptions>): Partial<AppPDFOptions> {
  const optimized = { ...options };

  // Compression si le document est grand
  if (options.format && !['a4', 'letter'].includes(options.format)) {
    optimized.format = 'a4'; // Format standard pour la compatibilité
  }

  // Taille de police optimisée pour la lisibilité
  if (!optimized.fontSize || optimized.fontSize < 10) {
    optimized.fontSize = 12;
  }

  // Marges par défaut si non spécifiées
  if (!optimized.margins) {
    optimized.margins = { top: 20, right: 20, bottom: 20, left: 20 };
  }

  return optimized;
}

/**
 * Crée un aperçu de PDF pour les tests
 */
export function createPDFPreview(content: string, options: Partial<AppPDFOptions>): string {
  const optimizedOptions: AppPDFOptions = {
    format: 'a4',
    orientation: 'portrait',
    margins: { top: 20, right: 20, bottom: 20, left: 20 },
    fontSize: 12,
    fontFamily: 'Arial',
    ...optimizePDFOptions(options)
  };

  const metrics = calculatePDFMetrics(content, optimizedOptions);
  const dimensions = getPageDimensions(
    options.format || 'a4',
    options.orientation || 'portrait'
  );

  // Calculer les estimations
  const readingTime = Math.ceil(metrics.wordCount / 200); // 200 mots par minute
  const estimatedSizeKB = Math.round(metrics.estimatedFileSize / 1024);

  return `
    PDF Preview
    ============

    Format: ${options.format || 'a4'} (${options.orientation || 'portrait'})
    Taille: ${dimensions.width}mm × ${dimensions.height}mm
    Police: ${options.fontSize || 12}pt

    Contenu:
    - ${metrics.wordCount} mots
    - ${metrics.charCount} caractères
    - ${metrics.paragraphsCount} paragraphes
    - ${metrics.pageCount} pages estimées

    Estimations:
    - Temps de lecture: ${readingTime} minute(s)
    - Taille du fichier: ~${estimatedSizeKB}KB
    - Temps de génération: ~${Math.round(estimateRenderTime(metrics) / 1000)}s

    ---
    ${content.substring(0, 500)}${content.length > 500 ? '...' : ''}
  `;
}

/**
 * Gère les erreurs de génération PDF
 */
export class PDFGenerationError extends Error {
  public readonly stage: 'parsing' | 'rendering' | 'compression' | 'finalization';
  public readonly details?: any;
  public readonly recoverable: boolean;

  constructor(
    message: string,
    stage: PDFGenerationError['stage'],
    recoverable: boolean = true,
    details?: any
  ) {
    super(message);
    this.name = 'PDFGenerationError';
    this.stage = stage;
    this.recoverable = recoverable;
    this.details = details;
  }
}

/**
 * Utilitaire pour le débogage PDF
 */
export class PDFDebugger {
  private static instance: PDFDebugger;
  private logs: Array<{
    timestamp: Date;
    level: 'debug' | 'info' | 'warn' | 'error';
    message: string;
    data?: any;
  }> = [];

  static getInstance(): PDFDebugger {
    if (!PDFDebugger.instance) {
      PDFDebugger.instance = new PDFDebugger();
    }
    return PDFDebugger.instance;
  }

  log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: any): void {
    const log = {
      timestamp: new Date(),
      level,
      message,
      data,
    };

    this.logs.push(log);

    // Garder seulement les 100 derniers logs
    if (this.logs.length > 100) {
      this.logs.shift();
    }

    // Afficher dans la console en développement
    if (process.env.NODE_ENV === 'development') {
      console[level](`[PDF] ${message}`, data);
    }
  }

  getLogs(): typeof PDFDebugger.prototype.logs {
    return [...this.logs];
  }

  clear(): void {
    this.logs = [];
  }
}

export default {
  calculatePDFMetrics,
  getPageDimensions,
  pixelsToMM,
  mmToPixels,
  calculateOptimalScale,
  splitContentIntoPages,
  generateSafeFileName,
  validatePDFOptions,
  estimateRenderTime,
  optimizePDFOptions,
  createPDFPreview,
  PDFGenerationError,
  PDFDebugger,
};