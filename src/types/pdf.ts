import { PDFOptions, HeaderFooter, Margins } from './app';

/**
 * Types avancés pour la génération PDF
 */

export interface PDFMetrics {
  pageCount: number;
  estimatedFileSize: number; // in bytes
  renderTime: number; // in milliseconds
  wordCount: number;
  charCount: number;
  lineHeight: number;
  paragraphsCount: number;
}

export interface PDFGenerationOptions extends PDFOptions {
  quality?: 'low' | 'medium' | 'high';
  compression?: boolean;
  optimizeFor?: 'web' | 'print' | 'archive';
  password?: string;
  encryption?: {
    userPassword?: string;
    ownerPassword?: string;
    permissions: PDFPermissions;
  };
  metadata?: PDFMetadata;
  watermarks?: Watermark[];
  bookmarks?: PDFBookmark[];
  links?: boolean;
  background?: PDFBackground;
}

export interface PDFPermissions {
  printing: boolean;
  copying: boolean;
  modifying: boolean;
  annotating: boolean;
  fillingForms: boolean;
  extracting: boolean;
}

export interface PDFMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
  customProperties?: Record<string, string>;
}

export interface Watermark {
  text: string;
  opacity: number;
  rotation: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  position: 'center' | 'corner' | 'diagonal' | 'custom';
  coordinates?: {
    x: number;
    y: number;
  };
  pages?: 'all' | 'first' | 'last' | number[];
}

export interface PDFBookmark {
  title: string;
  level: number;
  destination: string;
  children?: PDFBookmark[];
}

export interface PDFBackground {
  type: 'color' | 'image' | 'gradient';
  value: string;
  opacity: number;
  repeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
}

export interface PDFPage {
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

export interface PDFGenerationResult {
  blob: Blob;
  url: string;
  filename: string;
  size: number;
  pages: number;
  metrics: PDFMetrics;
  generationTime: number;
}

export interface PDFValidationError {
  field: keyof PDFGenerationOptions;
  message: string;
  value: any;
  constraint: string;
}

export interface PDFTemplate {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'academic' | 'creative' | 'technical' | 'custom';
  styles: PDFTemplateStyles;
  layout: PDFTemplateLayout;
  preview: string;
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PDFTemplateStyles {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
    headings: string;
    links: string;
    code: string;
    quotes: string;
  };
  spacing: {
    paragraphs: number;
    headings: number;
    lists: number;
    code: number;
    tables: number;
  };
  borders: {
    width: number;
    style: 'solid' | 'dashed' | 'dotted';
    color: string;
    radius: number;
  };
}

export interface PDFTemplateLayout {
  pageSize: 'a4' | 'letter' | 'legal' | 'custom';
  orientation: 'portrait' | 'landscape';
  dimensions?: {
    width: number;
    height: number;
  };
  margins: Margins;
  header?: PDFTemplateHeaderFooter;
  footer?: PDFTemplateHeaderFooter;
  columns?: number;
  columnGap?: number;
  pageNumbers?: {
    show: boolean;
    position: 'top' | 'bottom' | 'left' | 'right' | 'center';
    format: 'numeric' | 'roman' | 'alphabetic';
    offset: number;
  };
}

export interface PDFTemplateHeaderFooter extends HeaderFooter {
  height?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

export interface PDFExportOptions {
  format: 'pdf' | 'docx' | 'html' | 'markdown' | 'txt';
  template?: string;
  options?: Partial<PDFGenerationOptions>;
  filename?: string;
}

// Types pour les performances PDF
export interface PDFPerformanceOptions {
  enableCaching: boolean;
  cacheSize: number; // in MB
  compressionLevel: number; // 0-9
  optimizeImages: boolean;
  lazyLoading: boolean;
  workerCount: number;
}

export interface PDFGenerationProgress {
  stage: 'parsing' | 'rendering' | 'compression' | 'finalization';
  progress: number; // 0-100
  currentPage: number;
  totalPages: number;
  estimatedTimeRemaining: number; // in seconds
  errors: string[];
}

export interface PDFError extends Error {
  code: string;
  stage: 'parsing' | 'rendering' | 'compression' | 'finalization';
  details?: any;
  recoverable: boolean;
}

// Types pour les fonctionnalités avancées
export interface PDFFormField {
  id: string;
  type: 'text' | 'checkbox' | 'radio' | 'dropdown' | 'signature';
  name: string;
  value: any;
  required: boolean;
  readOnly: boolean;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  properties?: Record<string, any>;
}

export interface PDFAnnotation {
  id: string;
  type: 'text' | 'highlight' | 'underline' | 'strikeout' | 'note' | 'link';
  content: string;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  author?: string;
  createdAt: Date;
  color?: string;
  properties?: Record<string, any>;
}

export interface PDFSignature {
  id: string;
  signer: {
    name: string;
    email?: string;
    certificate?: string;
  };
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  timestamp: Date;
  isValid: boolean;
  certificateData?: string;
}