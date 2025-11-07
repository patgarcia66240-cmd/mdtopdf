export interface AppState {
  markdown: string;
  pdfOptions: PDFOptions;
  isLoading: boolean;
  error: string | null;
}

export interface PDFOptions {
  format: 'a4' | 'letter' | 'legal';
  orientation: 'portrait' | 'landscape';
  margins: Margins;
  header?: HeaderFooter;
  footer?: HeaderFooter;
  fontSize: number;
  fontFamily: string;
}

export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface HeaderFooter {
  text: string;
  alignment: 'left' | 'center' | 'right';
  fontSize: number;
  fontStyle: 'normal' | 'bold' | 'italic';
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'academic' | 'creative' | 'custom';
  styles: TemplateStyles;
  layout: TemplateLayout;
  preview: string;
  content?: string;
  style?: any;
  colors: string[];
  isPro: boolean;
}

export interface TemplateStyles {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
}

export interface TemplateLayout {
  margins: Margins;
  header?: HeaderFooter;
  footer?: HeaderFooter;
  pageSize: 'a4' | 'letter' | 'legal';
  orientation: 'portrait' | 'landscape';
}

export interface RecentFile {
  id: string;
  name: string;
  content: string;
  lastModified: Date;
  size: number;
}
